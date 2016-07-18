// Seq.js
// =================
var imports = require('../config/imports');
var mongoose = imports.getMongoose();
// =================
var SequenceSchema = {}, Sequence;
// Schema -> Seq :


SequenceSchema = mongoose.Schema({
    nextSeqNumber: { type: Number, default: 1 }
});

SequenceSchema.methods.nextId = function (model) {
    Sequence = model;
    return {
    next: function(callback){
      Sequence.find( function (err, data) {
        if(err){ console.error(err); }
        if(data.length < 1){
          // create if doesn't exist create and return first
          Sequence.create({}, function(err, seq){
            if(err) { throw(err); }
            callback(seq.nextSeqNumber);
          });
        } else {
          // update sequence and return next
          Sequence.findByIdAndUpdate(data[0]._id, { $inc: { nextSeqNumber: 1 } }, function(err, seq){
            if(err) { throw(err); }
            callback(seq.nextSeqNumber);
          });
        }
      });
    }
  };
}

module.exports = SequenceSchema;