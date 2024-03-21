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
        const searchCategory = isNaN(parseInt(category)) ? 2 : (parseInt(category) > 0 && parseInt(category) < 6 ? `(${parseInt(category)})` : '(1,2,3,4,5)');

        if(! isNaN(parseInt(maxDays)) && parseInt(maxDays) !== 0){
            const rawAge = Date.now() - (1000 * 3600 * 24 * parseInt(maxDays));
            minDate = new Date(rawAge).toISOString().split('T')[0];
        }
        if(user){
            var { data, error } = await supabase.from('ad').select(`id, title, price, description, location, lng, lat, created_at, status_id, image!inner(file_path), category!inner(name), status!inner(type)`)
            .eq('user_id', user)
            .textSearch('title', q, { type: 'websearch', config: 'english' })
        }
        else if (q) {
            var { data, error } = await supabase.from('ad').select(`id, title, price, description, location, lng, lat, created_at, status_id, image!inner(file_path), category!inner(name), status!inner(type)`)
            .filter('price','gte', searchMinPrice)
            .filter('price','lte', searchMaxPrice)
            .filter('category_id', 'in', searchCategory)
            .filter('status_id', 'in', searchStatus)
            .filter('created_at', 'gte', minDate)
            .textSearch('title', q, { type: 'websearch', config: 'english' })
        }
        else{
            var { data, error } = await supabase.from('ad').select(`id, title, price, description, location, lng, lat, created_at, status_id, image!inner(file_path), category!inner(name), status!inner(type)`)
            .filter('price','gte', searchMinPrice)
            .filter('price','lte', searchMaxPrice)
            .filter('category_id', 'in', searchCategory)
            .filter('status_id', 'in', searchStatus)
            .filter('created_at', 'gte', minDate)
        }

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