const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
                                            {
                                                 fullname: {
                                                         type: String,
                                                         required: true
                                                        },

                                                 username: {
                                                         type: String,
                                                         required: true
                                                        },
                                                        
                                                 email: {
                                                         type: String,
                                                         required: true,
                                                         unique: true
                                                        },
                                                        
                                                 password: {
                                                         type: String,
                                                         required: true
                                                        },
                                                        

                                                 credentialAcct: {
                                                                    type: Boolean,
                                                                    default: false
                                                                },
                                            },
                                                { timestamps: true }
                                        );

const userModel = mongoose.model("USER", userSchema);

module.exports = userModel;