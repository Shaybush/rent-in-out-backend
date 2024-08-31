import express from 'express';
import { auth, authAdmin } from '../middlewares/auth';
import {
	changeActiveStatus,
	changePostRange,
	countAllPosts,
	countMyPosts,
	countPostLikes,
	countPostsByCategory,
	deletePost,
	deleteSinglePostImage,
	getAllPosts,
	getPostByID,
	getTopThreeLikes,
	getUserPosts,
	likePost,
	onCancelDelete,
	searchPosts,
	updatePost,
	uploadPost,
} from '../services/postService';
import { postControl, postRangeControl } from '../controllers/postControl';
const router = express();

/**
 * @swagger
 * /posts:
 *   get:
 *     tags:
 *       - Posts operations
 *     description: Retrieve a list of all posts with pagination, sorting, and filtering options.
 *     parameters:
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 15
 *           maximum: 20
 *         description: Number of posts to return per page (maximum is 20).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: The field to sort the posts by.
 *       - in: query
 *         name: reverse
 *         schema:
 *           type: string
 *           enum: [yes, no]
 *           default: no
 *         description: Whether to reverse the sort order (use 'yes' for descending order).
 *     responses:
 *       200:
 *         description: A list of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/post"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   description: Error message
 */
router.get('/', getAllPosts);

/**
 * @swagger
 * /posts/getPostByID/{postID}:
 *   get:
 *     tags:
 *       - Posts operations
 *     description: Retrieve a specific post by providing its ID.
 *     parameters:
 *       - in: path
 *         name: postID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the post.
 *     responses:
 *       200:
 *         description: A post object.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: "#/components/schemas/post"
 *       404:
 *         description: Post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   description: Error message
 */
router.get('/getPostByID/:postID', getPostByID);

/**
 * @swagger
 * /posts/count:
 *   get:
 *     tags:
 *       - Posts operations
 *     description: Returns the total number of posts in the database.
 *     responses:
 *       200:
 *         description: The total number of posts.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: The total number of posts in the database.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message.
 *                 err:
 *                   type: string
 *                   description: Details of the error.
 */
router.get('/count', countAllPosts);

/**
 * @swagger
 * /posts/search:
 *   get:
 *     tags:
 *       - Posts operations
 *     description: Search posts based on a query, price range, categories, and other options. Supports pagination and sorting.
 *     parameters:
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 15
 *           maximum: 20
 *         description: Number of posts to return per page.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number to retrieve.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field by which to sort the results.
 *       - in: query
 *         name: reverse
 *         schema:
 *           type: string
 *           enum: [yes, no]
 *           default: no
 *         description: Whether to sort results in descending order.
 *       - in: query
 *         name: searchQ
 *         schema:
 *           type: string
 *         description: Search query to match against post titles.
 *       - in: query
 *         name: max
 *         schema:
 *           type: number
 *         description: Maximum price for filtering posts.
 *       - in: query
 *         name: min
 *         schema:
 *           type: number
 *         description: Minimum price for filtering posts.
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: Comma-separated list of categories to filter posts by.
 *     responses:
 *       200:
 *         description: A list of posts matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: The number of posts returned.
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/post"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   description: Error message
 */
router.get('/search', searchPosts);

/**
 * @swagger
 * /posts/checkLikes/{postID}:
 *   get:
 *     tags:
 *       - Posts operations
 *     description: Retrieve the total number of likes for a post identified by its ID.
 *     parameters:
 *       - in: path
 *         name: postID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the post.
 *     responses:
 *       200:
 *         description: The number of likes for the post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: The total number of likes.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message.
 *                 err:
 *                   type: string
 *                   description: Details of the error.
 */
router.get('/checkLikes/:postID', countPostLikes);

/**
 * @swagger
 * /posts/topThreeLikes/{postID}:
 *   get:
 *     tags:
 *       - Posts operations
 *     description: Get the first three likes for a post identified by its ID. This retrieves a subset of likes from the post.
 *     parameters:
 *       - in: path
 *         name: postID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the post.
 *     responses:
 *       200:
 *         description: The top three likes for the post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 likes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the like.
 *                       user_id:
 *                         type: string
 *                         description: The ID of the user who liked the post.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message.
 *                 err:
 *                   type: string
 *                   description: Details of the error.
 */
router.get('/topThreeLikes/:postID', getTopThreeLikes);

/**
 * @swagger
 * /posts/countMyPosts:
 *   get:
 *     tags:
 *       - Posts operations
 *     summary: Must be connected as user
 *     description: Retrieves the total number of posts created by the user identified by the token in the request. Ensure that the request includes authentication middleware to set `req.tokenData`.
 *     security:
 *       - apiKeyAuth: []   # This line adds the x-api-key to this specific route
 *     responses:
 *       200:
 *         description: The number of posts created by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: The total number of posts created by the user.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message.
 *                 err:
 *                   type: string
 *                   description: Details of the error.
 *     components:
 *       securitySchemes:
 *         apiKeyAuth:
 *           type: http
 *           scheme: bearer
 *           bearerFormat: JWT
 */
router.get('/countMyPosts', auth, countMyPosts);

/**
 * @swagger
 * /posts/userPosts/{userID}:
 *   get:
 *     tags:
 *       - Posts operations
 *     description: Fetches a paginated and sorted list of posts created by the user identified by the `userID` parameter.
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user whose posts are to be retrieved.
 *       - in: query
 *         name: perPage
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 20
 *         description: Number of posts to return per page (up to a maximum of 20).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number to retrieve.
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field by which to sort the results.
 *       - in: query
 *         name: reverse
 *         schema:
 *           type: string
 *           enum: [yes, no]
 *           default: no
 *         description: Whether to sort results in descending order.
 *     responses:
 *       200:
 *         description: A paginated and sorted list of posts created by the specified user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/post"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   description: Error message.
 */
router.get('/userPosts/:userID', getUserPosts);

/**
 * @swagger
 * /posts/count-by-category:
 *   get:
 *     tags:
 *       - Posts operations
 *     description: Retrieves the count of posts grouped by their categories. This endpoint aggregates posts to provide a count for each category.
 *     responses:
 *       200:
 *         description: A list of categories with the count of posts in each category.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: The name of the category.
 *                   count:
 *                     type: integer
 *                     description: The number of posts in the category.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message.
 *                 err:
 *                   type: string
 *                   description: Details of the error.
 */
router.get('/count-by-category', countPostsByCategory);

/**
 * @swagger
 * /posts:
 *   post:
 *     tags:
 *       - Posts operations
 *     summary: Must be connected as user
 *     description: Creates a new post with the provided data. The `creator_id` is set from the authenticated user token. The newly created post is then returned.
 *     security:
 *       - apiKeyAuth: []  # Indicates that the endpoint requires a bearer token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post.
 *               content:
 *                 type: string
 *                 description: The content of the post.
 *               category_url:
 *                 type: string
 *                 description: The category of the post.
 *               price:
 *                 type: number
 *                 description: The price associated with the post (if applicable).
 *             required:
 *               - title
 *               - content
 *     responses:
 *       201:
 *         description: The newly created post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the post.
 *                 title:
 *                   type: string
 *                   description: The title of the post.
 *                 content:
 *                   type: string
 *                   description: The content of the post.
 *                 category_url:
 *                   type: string
 *                   description: The category of the post.
 *                 price:
 *                   type: number
 *                   description: The price associated with the post (if applicable).
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The creation timestamp of the post.
 *                 creator_id:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: The unique identifier of the creator.
 *                     username:
 *                       type: string
 *                       description: The username of the post creator.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: string
 *                   description: Error message.
 */
router.post('/', auth, postControl, uploadPost);

/**
 * @swagger
 * /posts/likePost/{postID}:
 *   post:
 *     tags:
 *       - Posts operations
 *     summary: Must be connected as user
 *     description: Allows a user to like or unlike a post. If the user likes the post, the post's likes are updated, and the post is added to the user's wishlist if not already present. If the user unlikes the post, the like is removed and the post is removed from the user's wishlist if present.
 *     security:
 *       - apiKeyAuth: []    # Indicates that the endpoint requires a bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: postID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the post to be liked or unliked.
 *     responses:
 *       201:
 *         description: Success message with updated post likes and status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/user"
 *                 msg:
 *                   type: string
 *                   description: Status message indicating whether the post was liked or unliked.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message.
 */
router.post('/likePost/:postID', auth, likePost);

/**
 * @swagger
 * /posts/singleImgDel/{postID}/{imgID}:
 *   delete:
 *     tags:
 *       - Posts operations
 *     summary: Must be connected as user
 *     description: Removes a specific image from a post and deletes the image from Cloudinary using its image ID. The post's image list is updated accordingly.
 *     security:
 *       - apiKeyAuth: []  # Indicates that the endpoint requires a bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: postID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the post from which the image will be deleted.
 *       - in: path
 *         name: imgID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the image to be deleted from Cloudinary.
 *     responses:
 *       200:
 *         description: Success message indicating that the image was deleted from both the post and Cloudinary.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Status message confirming the successful deletion of the image.
 *                 error:
 *                   type: object
 *                   description: Contains error details if an error occurred during image deletion from Cloudinary.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message indicating that an error occurred.
 *                 error:
 *                   type: object
 *                   description: Details of the error encountered.
 */
router.post('/singleImgDel/:postID/:imgID', auth, deleteSinglePostImage);

/**
 * @swagger
 * /cancel-delete:
 *   post:
 *     tags:
 *       - General operations
 *     summary: Must be connected as user
 *     description: Endpoint to handle the cancellation of a delete operation. Returns a success message indicating that the delete operation was cancelled.
 *     responses:
 *       200:
 *         description: Success message confirming that the delete operation was cancelled.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Status message confirming the cancellation of the delete operation.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message indicating that an error occurred.
 *                 err:
 *                   type: object
 *                   description: Details of the error encountered.
 */
router.post('/onCancelImgDel', auth, onCancelDelete);

/**
 * @swagger
 * /posts/{postID}:
 *   put:
 *     tags:
 *       - Posts operations
 *     summary: Must be connected as user
 *     description: Allows updating a post by its ID. Admins can update any post, while regular users can only update posts they created. The post's `updatedAt` field is also updated to reflect the time of the update.
 *     security:
 *       - apiKeyAuth: []  # Indicates that the endpoint requires a bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: postID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the post to be updated.
 *     requestBody:
 *       description: The fields of the post to be updated.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the post.
 *               content:
 *                 type: string
 *                 description: The new content of the post.
 *               price:
 *                 type: number
 *                 description: The new price of the post.
 *               category_url:
 *                 type: string
 *                 description: The new category URL of the post.
 *               [other fields]:
 *                 type: string
 *                 description: Other fields that may be updated.
 *     responses:
 *       200:
 *         description: Success message with updated post data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: The result of the update operation.
 *                   properties:
 *                     modifiedCount:
 *                       type: integer
 *                       description: Number of documents modified.
 *                 msg:
 *                   type: string
 *                   description: Status message indicating that the post was edited.
 *       400:
 *         description: Bad request, indicating the update operation was not successful or if the user is not authorized to update the post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: Details of the failed update operation.
 *                 msg:
 *                   type: string
 *                   description: Error message indicating why the post could not be updated.
 *                 err:
 *                   type: object
 *                   description: Details of any error encountered.
 *       401:
 *         description: Unauthorized error if the user does not have permission to update the post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message indicating unauthorized access.
 */
router.put('/:postID', auth, updatePost);

/**
 * @swagger
 * /posts/changeRange/{postID}:
 *   put:
 *     tags:
 *       - Posts operations
 *     summary: Must be connected as user
 *     description: Updates the range of a post specified by its ID. Only admins can update any post, while regular users can only update posts they created. Superadmin posts cannot have their range changed.
 *     security:
 *       - apiKeyAuth: []  # Indicates that the endpoint requires a bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: postID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the post whose range is to be updated.
 *     requestBody:
 *       description: The new range value to be set for the post.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               range:
 *                 type: string
 *                 description: The new range to be set for the post.
 *     responses:
 *       200:
 *         description: Success message with the result of the update operation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: The result of the update operation.
 *                   properties:
 *                     matchedCount:
 *                       type: integer
 *                       description: Number of documents matched for the update.
 *                     modifiedCount:
 *                       type: integer
 *                       description: Number of documents modified.
 *       401:
 *         description: Unauthorized access error if trying to change the range of a superadmin post or if the user does not have permission to update the post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message indicating why the range could not be changed.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message indicating that an error occurred.
 *                 err:
 *                   type: object
 *                   description: Details of the error encountered.
 */
router.patch('/changeRange/:postID', auth, postRangeControl, changePostRange);

/**
 * @swagger
 * /posts/changeActive/{postID}:
 *   patch:
 *     tags:
 *       - Posts operations
 *     summary: Must be connected as admin
 *     description: Toggles the `active` status of a post by its ID. Admins can change the status of any post, but the operation will not affect posts with a specific `superID` which is protected.
 *     security:
 *       - apiKeyAuth: []  # Indicates that the endpoint requires a bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: postID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the post whose active status is being toggled.
 *     responses:
 *       200:
 *         description: Success message with the updated post data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the post.
 *                 active:
 *                   type: boolean
 *                   description: The updated active status of the post.
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp of when the post was last updated.
 *       401:
 *         description: Unauthorized error if attempting to change the status of a protected post or if not authorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message indicating why the status could not be changed.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message indicating that an error occurred during the operation.
 *                 err:
 *                   type: object
 *                   description: Details of the error encountered.
 */
router.patch('/changeActive/:postID', authAdmin, changeActiveStatus);

/**
 * @swagger
 * /posts/{postID}:
 *   delete:
 *     tags:
 *       - Posts operations
 *     summary: Must be connected as user
 *     description: Deletes a post specified by its ID from the database and removes its associated images from Cloudinary. If an error occurs while deleting the images from Cloudinary, it will be returned in the response.
 *     security:
 *       - apiKeyAuth: []    # Indicates that the endpoint requires a bearer token for authentication
 *     parameters:
 *       - in: path
 *         name: postID
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the post to be deleted.
 *     responses:
 *       200:
 *         description: Success message indicating that the post was successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Success message confirming the post deletion.
 *       400:
 *         description: Bad request error if the postID is invalid or if there is an issue with deleting the post.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: object
 *                   description: Details of the error encountered.
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: Error message.
 *                     name:
 *                       type: string
 *                       description: Error name.
 *                     http_code:
 *                       type: integer
 *                       description: HTTP status code.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Error message indicating that an error occurred during the post deletion.
 *                 err:
 *                   type: object
 *                   description: Details of the error encountered.
 */
router.delete('/:postID', auth, deletePost);

export default router;
