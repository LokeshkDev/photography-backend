import mongoose from "mongoose";

// const eventSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },

//     description: {
//       type: String,
//       default: "",
//     },
    
//     name: {
//       type: String,
//       default: "",
//     },

//     // IMPORTANT: use "client" (NOT clientId)
//     client: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // must reference user collection
//       required: false,
//     },

//     selectionLimit: {
//       type: Number,
//       default: 0,
//     },

//     photos: {
//       type: [String],
//       default: [],
//     },

//     archived: {
//       type: Boolean,
//       default: false, 
//     },
//   },
//   { timestamps: true }
// );

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    clientName: {
      type: String,
      default: "",
    },

    selectionLimit: Number,
    photos: [String],
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


export default mongoose.model("Event", eventSchema);
