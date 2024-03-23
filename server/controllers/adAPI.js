import supabase from "../config/supabaseConfig.js";

export async function getUserAds(req, res) {
  let { user_id } = req.query;
  try {
    const myListings = await supabase
      .from("ad")
      .select("*")
      .eq("user_id", user_id);
    res.status(200).json(myListings);
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
  let {categoryId} = req.params
  
  try {
    if (!categoryId) {
      const postData = await supabase.from("ad").select(
        `
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
            category!inner(name),
            status!inner(type)
            `
      );
      res.status(200).json(postData.data);
    }
    else {
      const postData = await supabase.from("ad").select(
        `
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
            category!inner(name),
            status!inner(type)
            `
      )
      .eq('category_id', categoryId);

      res.status(200).json(postData.data);
    }
   
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
