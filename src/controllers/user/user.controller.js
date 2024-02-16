const { StatusCodes } = require("http-status-codes");
const { User } = require("../../models/User.model");
const { response } = require("../../utils/response");
const { securePassword } = require("../../utils/securePassword");

const createUser = async (req, res) => {
 const { name, email, password, mobile, photo, userType } = req.body;

 if (!name || !email || !password || !userType) {
  return response(
   res,
   StatusCodes.BAD_REQUEST,
   false,
   {},
   "Please Provide all information"
  );
 }

 try {
  const oldUser = await User.findOne({
   email: email,
  });
  if (oldUser) {
   return response(
    res,
    StatusCodes.NOT_ACCEPTABLE,
    false,
    {},
    "This Email Already have an Account"
   );
  }
  if (password.length < 6) {
   return response(
    res,
    StatusCodes.NOT_ACCEPTABLE,
    false,
    {},
    "Password must be minimum 6 charecter"
   );
  }

  const hashedPassword = await securePassword(req.body.password);

  const user = await User.create({
   email: email,
   password: hashedPassword,
   userType: userType,
   activeStatus: true,
   name: name,
   mobile: mobile,
   photo: photo,
  });

  if (!user) {
   return response(
    res,
    StatusCodes.FORBIDDEN,
    false,
    {},
    "Could not create user due to user error"
   );
  }

  return response(res, StatusCodes.ACCEPTED, true, { user: user }, null);
 } catch (error) {
  return response(
   res,
   StatusCodes.INTERNAL_SERVER_ERROR,
   false,
   {},
   error.message
  );
 }
};

// Get Users
const getUsers = async (req, res) => {
 const { skip, limit, activeStatus, searchKey, sortBy } = req.body;

 try {
  const usersCount = await User.countDocuments()
   .where(
    searchKey
     ? {
        $or: [
         {
          name: { $regex: searchKey, $options: "i" },
         },
         {
          email: { $regex: searchKey, $options: "i" },
         },
         {
          mobile: { $regex: searchKey, $options: "i" },
         },
        ],
       }
     : null
   )
   .where(activeStatus !== undefined ? { activeStatus: activeStatus } : null);

  const users = await User.find()
   .select("name email mobile userType activeStatus photo")
   .where(
    searchKey
     ? {
        $or: [
         {
          name: { $regex: searchKey, $options: "i" },
         },
         {
          email: { $regex: searchKey, $options: "i" },
         },
         {
          mobile: { $regex: searchKey, $options: "i" },
         },
        ],
       }
     : null
   )
   .where(activeStatus !== undefined ? { activeStatus: activeStatus } : null)
   .sort(sortBy ? { [sortBy.field]: [sortBy.order] } : { createdAt: -1 })
   .limit(limit ? limit : null)
   .skip(skip ? skip : null);

  if (!users || users.length === 0) {
   return response(res, StatusCodes.NOT_FOUND, false, {}, "No users Found");
  }

  return response(
   res,
   StatusCodes.OK,
   true,
   { usersCount: usersCount, users: users },
   null
  );
 } catch (error) {
  return response(
   res,
   StatusCodes.INTERNAL_SERVER_ERROR,
   false,
   {},
   error.message
  );
 }
};

// Get User Details
const getUserDetails = async (req, res) => {
 const { id } = req.params;

 try {
  const user = await User.findById(id).select(
   "name email activeStatus userType mobile photo"
  );
  if (!user) {
   return response(res, StatusCodes.NOT_FOUND, false, {}, "No user Found!");
  }

  return response(res, StatusCodes.OK, true, { user: user }, null);
 } catch (error) {
  return response(
   res,
   StatusCodes.INTERNAL_SERVER_ERROR,
   false,
   {},
   error.message
  );
 }
};

// Update User Dtails
const updateUserDetails = async (req, res) => {
 const { name, mobile, photo } = req.body;

 const id = req.params.id;

 let user = {};

 if (name) {
  user.name = name;
 }
 if (mobile) {
  user.mobile = mobile;
 }
 if (photo) {
  user.photo = photo;
 }

 if (user) {
  user.updatedAt = new Date();
  try {
   const newUser = await User.findByIdAndUpdate(id, user, {
    new: true,
   }).exec();
   if (!newUser) {
    return response(
     res,
     StatusCodes.BAD_REQUEST,
     false,
     {},
     "Could not update!"
    );
   }

   return response(res, StatusCodes.ACCEPTED, true, { user: newUser }, null);
  } catch (error) {
   return response(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    false,
    {},
    error.message
   );
  }
 } else {
  return response(res, StatusCodes.BAD_REQUEST, false, {}, "Could not update!");
 }
};

// Update Status
const updateStatus = async (req, res) => {
 const { activeStatus, userType } = req.body;

 const id = req.params.id;

 let user = {};

 if (activeStatus !== undefined) {
  user.activeStatus = activeStatus;
 }

 if (userType) {
  user.userType = userType;
 }

 if (user) {
  user.updatedAt = new Date();
  try {
   const newUser = await User.findByIdAndUpdate(id, user, {
    new: true,
   }).exec();
   if (!newUser) {
    return response(
     res,
     StatusCodes.BAD_REQUEST,
     false,
     {},
     "Could not update!"
    );
   }

   return response(res, StatusCodes.ACCEPTED, true, { user: newUser }, null);
  } catch (error) {
   return response(
    res,
    StatusCodes.INTERNAL_SERVER_ERROR,
    false,
    {},
    error.message
   );
  }
 } else {
  return response(res, StatusCodes.BAD_REQUEST, false, {}, "Could not update!");
 }
};

// Delete User
const deleteUser = async (req, res) => {
 const id = req.params.id;

 if (!id) {
  return response(res, StatusCodes.NOT_FOUND, false, {}, "No User Found!");
 }

 try {
  const user = await User.findByIdAndDelete(id);

  if (!user) {
   return response(
    res,
    StatusCodes.BAD_REQUEST,
    false,
    {},
    "Could not delete!"
   );
  }

  return response(res, StatusCodes.ACCEPTED, true, { user: user }, null);
 } catch (error) {
  return response(
   res,
   StatusCodes.INTERNAL_SERVER_ERROR,
   false,
   {},
   error.message
  );
 }
};

module.exports = {
 getUsers,
 getUserDetails,
 updateUserDetails,
 updateStatus,
 deleteUser,
 createUser,
};
