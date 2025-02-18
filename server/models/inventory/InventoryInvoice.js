import mongoose from 'mongoose'; 

const Schema = mongoose.Schema;

const inventoryInvoiceSchema = new Schema({
        user: { type: Schema.Types.ObjectId, ref: 'User' }, 
        name: { type: String }, 
        description: { type: String }, 
        deleted_at: { type: String, default: null }, 
        deleted_by: { type: Schema.Types.ObjectId, ref: 'User' }, 
    }, 
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


let InventoryInvoice = mongoose.model('InventoryInvoice', inventoryInvoiceSchema); 
export default InventoryInvoice; 