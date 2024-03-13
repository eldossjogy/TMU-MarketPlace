import express from "express";
import supabase from "../config/supabaseConfig.js";

const router = express.Router();

// get your ads
router.get("/me", async (req, res) => {
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
});

// get ads by id
router.get("/", async (req, res) => {
  let { id } = req.query;
  try {
    const postData = await supabase
      .from("ad")
      .select(
        `
        *,
        image!inner(file_path),
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
});

// get homepage ads
router.get("/homepage", async (req, res) => {
  try {
    const postData = await supabase.from("ad").select(
      `
        id,
        title,
        price,
        description,
        postal_code,
        longitude,
        latitude,
        post_time,
        image!inner(file_path),
        category!inner(name),
        status!inner(type)
        `
    );
    res.status(200).json(postData.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
