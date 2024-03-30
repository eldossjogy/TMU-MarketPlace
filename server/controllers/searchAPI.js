import supabase from '../config/supabaseConfig.js'

export async function searchAds(req, res) {

    const {q, user, lng, lat, min, max, category, status, maxDays, page, range} = req.query;
    try {

        let minDate = new Date(0).toISOString().split('T')[0];
        //let pageCount = isNaN(parseInt(page)) ? 1 : parseInt(page);

        const searchMinPrice = !isNaN(parseInt(min)) ? parseInt(min) : 0;
        const searchMaxPrice = !isNaN(parseInt(max)) ? parseInt(max) : 2147483647;
        const searchStatus = !isNaN(parseInt(status)) ? (parseInt(status) > 0 && parseInt(status) < 4 ? `(${parseInt(status)})` : '(1,2,3)') : '(1)';
        const searchLatLng = {lat: isNaN(parseFloat(lat)) ? 43.6577518 : parseFloat(lat), lng: isNaN(parseFloat(lng)) ? -79.3786619 : parseFloat(lng)}
        const searchRange = isNaN(parseInt(range)) ? 100000 : parseInt(range);
        const searchCategory = isNaN(parseInt(category)) ? '(2)' : (parseInt(category) > 0 && parseInt(category) < 4 ? `(${parseInt(category)})` : '(1,2,3)');

        let supabaseQuery = supabase.from('ad').select(`id, title, price, description, location, lng, lat, created_at, status_id, image!left(file_path), category!inner(name), status!inner(type)`);

        if(! isNaN(parseInt(maxDays)) && parseInt(maxDays) !== 0){
            const rawAge = Date.now() - (1000 * 3600 * 24 * parseInt(maxDays));
            minDate = new Date(rawAge).toISOString().split('T')[0];
        }

        if(user) supabaseQuery = supabaseQuery.eq('user_id', user)

        supabaseQuery = supabaseQuery.filter('price','gte', searchMinPrice)
            .filter('price','lte', searchMaxPrice)
            .filter('category_id', 'in', searchCategory)
            .filter('status_id', 'in', searchStatus)
            .filter('created_at', 'gte', minDate)

        if(q) supabaseQuery = supabaseQuery.textSearch('title', q, { type: 'websearch', config: 'english' })

        var { data, error } = await supabaseQuery;

        if(error){
            console.log(error);
            res.status(500).json({
                data: null,
                error: {
                    message: "Search Failed.", 
                    error: error 
                }
            });
            return;
        }

        let parsedData = []

        for (let i = 0; i < data.length; i++) {
            let element = data[i];
            const distance = cosineDistanceBetweenPoints(element.lat, element.lng, searchLatLng.lat, searchLatLng.lng);
            if(distance <= searchRange){
                element.distance = distance;
                parsedData.push(element);
            }
        }

        res.status(200).json({
            data: parsedData,
            error: null
        });
    }
    catch(error) {
        console.log(error)
        if(error.status === 401) {
            res.status(401).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
        else {
            res.status(500).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
    }
} 

export async function addToHistory(req, res) {
    //TODO add {ad_id, user_id} to history with created_at
    const {ad_id, user_id} = req.body;
    try {
        var { data, error } = await supabase.from('history').select('id, view_count').match({ad_id: ad_id, user_id: user_id});

        if (error) {
            console.log(error);
            return;
        }

        if(data[0]){
            let history_id = data[0].id;
            let last_view_count = data[0].view_count;
            
            // console.log(history_id);
            var { data, error } = await supabase.from('history').update({'created_at': new Date().toISOString(), 'view_count': last_view_count + 1}).eq('id', history_id);
        }
        else{
            var { data, error } = await supabase.from('history').insert({ad_id: ad_id, user_id: user_id});
        }

        if (error){
            console.log(error);
            res.status(500).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
        else{
            res.status(200).json({
                data: null,
                error: null
            });
        }
    } catch (error) {
        console.log(error)
        if(error.status === 401) {
            res.status(401).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
        else {
            res.status(500).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
    }
}

export async function getUserHistory(req, res) {
    //TODO get {ad_id, created_at} from history with user_id  
    const {user_id} = req.body;
    const {limit} = req.query;
    try {
        let query = supabase.from('history').select(`id, ad_id, created_at, ad!inner(title, description, price, status_id, status!inner(type), image!left(file_path), location, lng, lat)`)
        .eq('user_id', user_id).filter('ad.status_id', 'in', '(1,2,3)').order('created_at');

        if(!isNaN(parseInt(limit))) query = query.limit(parseInt(limit));

        const { data, error } = await query;

        if(error){
            console.log(error);
            res.status(500).json({
                data: null,
                error: {
                    message: "History Search Failed.", 
                    error: error 
                }
            });
            return;
        }

        res.status(200).json({
            data: data.reverse(),
            error: null
        });
    } catch (error) {
        console.log(error)
        if(error.status === 401) {
            res.status(401).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
        else {
            res.status(500).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
    }
}

export async function addToSaved(req, res) {
    //TODO add {ad_id, user_id} to history with created_at
    const {ad_id, user_id} = req.body;
    try {
        const existing_id = await checkIfExists(ad_id, user_id, 'saved');
        
        if(existing_id !== -1){
            res.status(200).json({
                data: existing_id,
                error: {
                    message: 'Already saved', 
                    error: error 
                }
            });
            return;
        }

        var { data, error } = await supabase.from('saved').insert({ad_id: ad_id, user_id: user_id}).select('id');

        if(error) throw new Error(error.message);
        
        res.status(200).json({
            data: data[0]?.id ?? null,
            error: null
        });
    } catch (error) {
        console.log(error)
        if(error.status === 401) {
            res.status(401).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
        else {
            res.status(500).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
    }
}

export async function getUserSavedListings(req, res) {
    const {user_id} = req.body;
    try {
        const { data, error } = await supabase.from('saved').select(`id, ad_id, created_at, ad!inner(title, description, price, status_id, status!inner(type), image!left(file_path), location, lng, lat)`)
        .filter('ad.status_id', 'in', '(1,2,3)').eq('user_id', user_id).order('created_at'); // , )

        if(error){
            console.log(error);
            res.status(500).json({
                data: null,
                error: {
                    message: "Saved Search Failed.", 
                    error: error 
                }
            });
            return;
        }

        res.status(200).json({
            data: data.reverse(),
            error: null
        });
    } catch (error) {
        console.log(error)
        if(error.status === 401) {
            res.status(401).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
        else {
            res.status(500).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
    }
}

export async function getUserSavedIDs(req, res) {
    const {user_id} = req.body;
    try {
        var { data, error } = await supabase.from('saved').select('id, ad_id').eq('user_id',user_id);
        if(error) throw new Error(error.message);

        let parsedData = {};

        for (let i = 0; i < data.length; i++) {
            let element = data[i];
            parsedData[element.ad_id] = element.id;
        }

        res.status(200).json({
            data: parsedData,
            error: null
        });
    } catch (error) {
        console.log(error)
        if(error.status === 401) {
            res.status(401).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
        else {
            res.status(500).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
    }
}

export async function deleteFromSaved(req, res) {
    const {ad_id, user_id} = req.body;
    try {
        var { data, error } = await supabase.from('saved').delete().match({ad_id: ad_id, user_id: user_id});

        if(error) throw new Error(error.message);

        else{
            res.status(204).json({
                data: null,
                error: null
            });
        };
    } catch (error) {
        console.log(error)
        if(error.status === 401) {
            res.status(401).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
        else {
            res.status(500).json({
                data: null,
                error: {
                    message: error.message, 
                    error: error 
                }
            });
        }
    }
}

async function checkIfExists(ad_id, user_id, table) {
    try {
        var { data, error } = await supabase.from(table).select('id').match({ad_id: ad_id, user_id: user_id});

        if(error) throw new Error(error.message);

        if(data[0]?.id) return data[0].id;

        return -1;
    } catch (error) {
        console.log(error.message);
        return -1;
    }
}

function cosineDistanceBetweenPoints(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const p1 = lat1 * Math.PI/180;
    const p2 = lat2 * Math.PI/180;
    const deltaP = p2 - p1;
    const deltaLon = lon2 - lon1;
    const deltaLambda = (deltaLon * Math.PI) / 180;
    const a = Math.sin(deltaP/2) * Math.sin(deltaP/2) +
              Math.cos(p1) * Math.cos(p2) *
              Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
    const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * R;
    return d;
}