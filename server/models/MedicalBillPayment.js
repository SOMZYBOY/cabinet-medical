import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const medicalBillSchema = new Schema({
        patient: { type: Schema.Types.ObjectId, ref: 'User' }, 
        authorizing_professional: { type: Schema.Types.ObjectId, ref: 'User' }, 
        medical_bill: { type: Schema.Types.ObjectId, ref: 'MedicalBill' }, 
        amount_paid: { type: Schema.Types.ObjectId, ref: 'User' }, 
        paid_on: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let MedicalBill = mongoose.model('MedicalBill', medicalBillSchema); 
export default MedicalBill; 