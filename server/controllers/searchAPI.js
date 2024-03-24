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
        const searchCategory = isNaN(parseInt(category)) ? '(2)' : (parseInt(category) > 0 && parseInt(category) < 6 ? `(${parseInt(category)})` : '(1,2,3,4,5)');

        let supabaseQuery = supabase.from('ad').select(`id, title, price, description, location, lng, lat, created_at, status_id, image!left(file_path), category!inner(name), status!inner(type)`)

        if(! isNaN(parseInt(maxDays)) && parseInt(maxDays) !== 0){
            const rawAge = Date.now() - (1000 * 3600 * 24 * parseInt(maxDays));
            minDate = new Date(rawAge).toISOString().split('T')[0];
        }

        if(user)  supabaseQuery = supabaseQuery.eq('user_id', user)

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
            const distance = cosineDistanceBetweenPoints(element.lat, element.lng, searchLatLng.lat, searchLatLng.lng)
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
        var { data, error } = await supabase.from('history').select('id').match({ad_id: ad_id, user_id: user_id});

        if (error) {
            console.log(error);
            return;
        }

        if(data[0]){
            let history_id = data[0].id;
            // console.log(history_id);
            var { data, error } = await supabase.from('history').update({'created_at': new Date().toISOString()}).eq('id', history_id);
        }
        else{
            var { data, error } = await supabase.from('history').insert({ad_id: ad_id, user_id: user_id});
        }

        if(data) console.log(data);
        else if (error) console.log(error);
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
        let query = supabase.from('history').select(`id, ad_id, created_at, ad!inner(title, description, price, status!inner(type), image!left(file_path), location, lng, lat)`).eq('user_id', user_id).order('created_at', {ascending: false});

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
            data: data,
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
        var { data, error } = await supabase.from('history').select('id').match({ad_id: ad_id, user_id: user_id});

        if (error) {
            console.log(error);
            return;
        }
        // console.log(data);

        if(data[0]){
            let history_id = data[0].id;
            // console.log(history_id);
            var { data, error } = await supabase.from('history').update({'created_at': new Date().toISOString()}).eq('id', history_id);
        }
        else{
            var { data, error } = await supabase.from('history').insert({ad_id: ad_id, user_id: user_id});
        }

        if(data) console.log(data);
        else if (error) console.log(error);
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
    //TODO get {ad_id, created_at} from history with user_id  
    const {user_id} = req.body;
    try {
        const { data, error } = await supabase.from('history').select(`id, ad_id, created_at, ad!inner(title, description, price, status!inner(type), image!left(file_path), location, lng, lat)`, { distinct: true })
        .eq('user_id', user_id).order('created_at', {ascending: false}); // , )
        //const { data, error } = await supabase.from('history').select('ad_id'); // , )

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
            data: data,
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