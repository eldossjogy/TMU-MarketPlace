import supabase from "../config/supabaseConfig.js";

export async function fetchUserProfile(req, res) {
  let { user_name } = req.query;
  try {
    const userData = await supabase
      .from("profile")
      .select("id,name,avatar_url,created_at,first_name,last_name")
      .eq("name", user_name);
    res.status(200).json(userData.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



 