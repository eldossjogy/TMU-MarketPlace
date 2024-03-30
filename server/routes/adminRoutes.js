import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { adminGetAllListings, adminGetQueryListing, adminPostNewListing, adminDeleteListing, adminUpdateListing, verifyAdmin, adminGetAllUsers, adminGetQueryUsers, adminGetAllAdminUsers, adminGetQueryAdminUsers, adminAddNewAdmin, adminDeleteAdminAccess, adminUpdateUser, adminDeleteUser } from "../controllers/adminAPI.js";
import { adminVerifyToken } from "../middleware/adminAuth.js";

const router = express.Router();

router.get('/verify-admin-privilege', verifyToken, verifyAdmin)

router.get('/get-all-listings', adminVerifyToken, adminGetAllListings)
router.get('/get-all-listings/query', adminVerifyToken, adminGetQueryListing)
router.get('/get-all-users', adminVerifyToken, adminGetAllUsers)
router.get('/get-all-users/query', adminVerifyToken, adminGetQueryUsers)
router.get('/get-all-admin-users', adminVerifyToken, adminGetAllAdminUsers)
router.get('/get-all-admin-users/query', adminVerifyToken, adminGetQueryAdminUsers)

router.post('/create-new-listing', adminVerifyToken, adminPostNewListing)
router.post('/add-new-admin', adminVerifyToken, adminAddNewAdmin)

router.put('/remove-admin-priv', adminVerifyToken, adminDeleteAdminAccess)
router.put('/delete-listing', adminVerifyToken, adminDeleteListing)
router.put('/delete-user', adminVerifyToken, adminDeleteUser)
router.put('/update-listing', adminVerifyToken, adminUpdateListing)
router.put('/update-user-record', adminVerifyToken, adminUpdateUser)


export default router;

