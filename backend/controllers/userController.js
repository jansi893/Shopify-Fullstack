import User from '../models/User.js';
import asyncHandler from 'express-async-handler'
import brcypt from "bcryptjs";
import nodemailer from "nodemailer";
import bcrypt from 'bcryptjs';


//get current user profile
export const getProfile =async(req,res)=>{
try {
      const user = await User.findById(req.user._id)
    .populate("wishlist" , "name price image")
    .select('-password')
    if(!user) return res.status(404).json({message:"User not found"});
    res.json(user)

} catch (error) {
  res.status(500).json({message:error.message})
}
};


export const listUsers = asyncHandler(async (req, res) => {
  // adminOnly middleware ensures admin
  const users = await User.find().select("-password");
  res.json(users);
});

// export const updateProfile = async(req,res)=>{
// try {
//       const user = await User.findById(req.user._id).select('-password')
//     if(!user) return res.status(404).json({message:"User not found"});

//     if(req.body.name) user.name = req.body.name;
//     if(req.body.password) {
//       const salt = await bcrypt.genSalt(10);
//       user.password = await bcrypt.hash(req.body.password,salt)
//     }

//     if(req.file){
//       user.avatar ={
//         public_id: req.file.filename,
//         url: file.path

//       }
//     }

//     if(req.body.address){
//       user.address={
//         Street:req.body.address.Street || user.address?.Street,
//          city:req.body.address.city || user.address?.city,
//          state:req.body.address.state || user.address?.state,
//           postalCode:req.body.address.postalCode || user.address?.postalCode,
//           country:req.body.address.country || user.address?.country,
        
//       }
//     }

//     if(req.body.email) user.email = req.body.email;

//     const updatedUser = await user.save();
//     if (updatedUser.email) {
//       await sendEmail(
//         updatedUser.email,
//         "Profile Updated Successfully",
//        ` Hello ${updatedUser.name},\n\nYour profile was successfully updated.\n\nIf this wasn’t you, please contact support.`
//       );
//     }

//     res.json({
//       message: "Profile updated successfully & email sent",
//       user: {
//         _id: updatedUser._id,
//         name: updatedUser.name,
//         email: updatedUser.email,
//         avatar: updatedUser.avatar,
//         isAdmin: updatedUser.isAdmin,
//       },
//     })
    

//     const {name,email,password,address} = req.body;

//     if(name) user.name = name;
//     if(email) user.email = email;
//     if(password) user.password = password;
//     if(address) user.address = address;

//     const updated = await user.save()

//     const userObj = updated.toObject();
//     delete userObj.password;
//     res.json(userObj);
// } catch (error) {
//   res.status(500).json({message})
// }


// };

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (req.body.name) user.name = req.body.name;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    if (req.file) {
      user.avatar = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    if (req.body.address) {
      user.address = {
        street: req.body.address.street || user.address?.street,
        city: req.body.address.city || user.address?.city,
        state: req.body.address.state || user.address?.state,
        postalCode: req.body.address.postalCode || user.address?.postalCode,
        country: req.body.address.country || user.address?.country,
      };
    }

    if (req.body.email) user.email = req.body.email;

    const updatedUser = await user.save();

    if (updatedUser.email) {
      await sendEmail(
        updatedUser.email,
        "Profile Updated Successfully",
        `Hello ${updatedUser.name},\n\nYour profile was successfully updated.\n\nIf this wasn’t you, please contact support.`
      );
    }

    res.json({
      message: "Profile updated successfully & email sent",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

//wishlist
export const getWishlist = async(req,res)=>{
  try {
    const user = await User.findById(req.user._id).populate("wishlist","name price image");
    res.json(user.wishList || [])
  } catch (error) {
    res.status(500).json({
      message:error.message
    })
  }
}

//order
export const getUserOrder = async(req,res)=>{
  try {
    const orders = await order.find({user:req.user._id})
    .populate("item.product","name price image")
    .sort({createdAt : -1});
    res.json(orders);
    
  } catch (error) {
     res.status(500).json({
      message:error.message
    })
  }
};

//admin controller
export const listUser = async(req,res)=>{
try {
  const users = await User.find({}).select("-password");
  res.json(users);
  
} catch (error) {
   res.status(500).json({
      message:error.message
    })
}
}

export const getUserById = asyncHandler (async(req,res)=>{
    const user = await User.findById(req.params.id).select('-password');
    if(!user) return res.status(404).json({message:"User not found"});
    res.json(user);
})

export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { name, email, role } = req.body;
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role; // validate on frontend that role is correct

  const updated = await user.save();
  const obj = updated.toObject();
  delete obj.password;
  res.json(obj);
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.remove();
  res.json({ message: "User removed" });
});