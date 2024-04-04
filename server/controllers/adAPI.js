import supabase from "../config/supabaseConfig.js";

export async function getUserAds(req, res) {
  let { user_id } = req.query;
  try {
    const myListings = await supabase
      .from("ad")
      .select(
        `      id,
      title,
      price,
      description,
      postal_code,
      location,
      lng,
      lat,
      post_time,
      image!inner(file_path),
      category_id,
      status!inner(type,id)`
      )
      .eq("user_id", user_id);
    res.status(200).json(myListings.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function getByID(req, res) {
  let { id } = req.query;
  try {
    const postData = await supabase
      .from("ad")
      .select(
        `
          *,
          image!left(file_path),
          category!inner(name),
          status!inner(type),
          profile!inner(id,name,avatar_url,postal_code)
          `
      )
      .eq("id", id);
    res.status(200).json(postData.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function homepage(req, res) {
  try {
      const category1Req = await supabase.from("ad").select(`
          id,
          title,
          price,
          description,
          postal_code,
          location,
          lng,
          lat,
          post_time,
          image!left(file_path),
          category_id,
          status!inner(type)
          `)
          .eq('category_id', 1)
          .eq('status_id', 1)
          .order('id', { ascending: false })
          .limit(5);

      const category2Req = await supabase.from("ad").select(`
          id,
          title,
          price,
          description,
          postal_code,
          location,
          lng,
          lat,
          post_time,
          image!left(file_path),
          category_id,
          status!inner(type)
          `)
          .eq('category_id', 2)
          .eq('status_id', 1)
          .order('id', { ascending: false })
          .limit(5);

      const category3Req = await supabase.from("ad").select(`
          id,
          title,
          price,
          description,
          postal_code,
          location,
          lng,
          lat,
          post_time,
          image!left(file_path),
          category_id,
          status!inner(type)
          `)
          .eq('category_id', 3)
          .eq('status_id', 1)
          .order('id', { ascending: false })
          .limit(5);
          
      const category4Req = await supabase.from("ad").select(`
          id,
          title,
          price,
          description,
          postal_code,
          location,
          lng,
          lat,
          post_time,
          image!left(file_path),
          category_id,
          status!inner(type)
          `)
          .eq('category_id', 4)
          .eq('status_id', 1)
          .order('id', { ascending: false })
          .limit(5);

      const category5Req = await supabase.from("ad").select(`
          id,
          title,
          price,
          description,
          postal_code,
          location,
          lng,
          lat,
          post_time,
          image!left(file_path),
          category_id,
          status!inner(type)
          `)
          .eq('category_id', 5)
          .eq('status_id', 1)
          .order('id', { ascending: false })
          .limit(5);

      const homepageData = {}
      homepageData[1] = category1Req.data
      homepageData[2] = category2Req.data
      homepageData[3] = category3Req.data
      homepageData[4] = category4Req.data
      homepageData[5] = category5Req.data

      res.status(200).json(homepageData)
    
  } catch (error) {
    console.error("Error fetching or processing ads:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
