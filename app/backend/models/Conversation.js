const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const ConversationSchema = new mongoose.Schema({
  conversationId: { type: String, index: true, required: true, unique: true },
  messages: { type: [messageSchema], default: [] },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

ConversationSchema.methods.append = function (role, content) {
  this.messages.push({ role, content, createdAt: new Date() });
  this.updatedAt = new Date();
  // keep messages bounded to last 50
  if (this.messages.length > 50) this.messages = this.messages.slice(-50);
  return this.save();
};

module.exports = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);
