const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema(
                                            {
                                             title: { 
                                                            type: String, 
                                                            required: true
                                                         },
                                                        
                                             dueDate: { 
                                                            type: Date, 
                                                            required: true
                                                         },
                                                        
                                                        

                                                category: {
                                                                type: String, 
                                                                required: true
                                                            },

                                                    
                                                 priority: { 
                                                                type: Number, 
                                                                min: 1, 
                                                                max: 3 
                                                             },
                                                 dueDate: { 
                                                            type: Date,
                                                            required: true
                                                         },
                                                         
                                                 userId: {
                                                            type: mongoose.Schema.Types.ObjectId,
                                                            ref: 'USER'
                                                        },
                                                    
                                                 description: { 
                                                                type: String,
                                                                required: true
                                                             },
                                                            
                                                        
                                                 completed: { 
                                                                type: Boolean,
                                                                 default: false
                                                             },
                                                             
                                                 reminder: { 
                                                                type: Boolean,
                                                                 default: false
                                                             }
                                             },
                                             { timestamps: true }
                                        );

const taskModel = mongoose.model("TASK", taskSchema)

module.exports = taskModel;