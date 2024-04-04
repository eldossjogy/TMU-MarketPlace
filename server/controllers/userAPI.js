import supabase from "../config/supabaseConfig.js";

export async function fetchUserProfile(req, res) {
  let { user_name } = req.query;
  try {
    const userData = await supabase
      .from("profile")
      .select("id,name,avatar_url,created_at,first_name,last_name,bio")
      .eq("name", user_name);
    res.status(200).json(userData.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function editUserProfile(req, res) {
  let { user_id, username, first_name, last_name, bio } = req.body;
  try {
    if (!username || !user_id || !first_name || !last_name || !bio) {throw new Error("missing input")}
    const {data:userData, error: userError} = await supabase
      .from("profile")
      .update({
        name: username.toLowerCase(),
        first_name: first_name,
        last_name: last_name,
        bio: bio
      })
      .eq("id", user_id)
      .select();
    if (userError) { throw userError}
    res.status(200).json(userData.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
