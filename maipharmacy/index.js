
  const express=require('express')
  const app=express()
  const cors=require('cors')
  const axios = require('axios');
  const bodyParser=require('body-parser')
 
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json())
  const PayStack = require('paystack-node')
  app.use(cors())
  const secretKey = require('./config');
  
  const ejs = require('ejs');
  const mongoose=require('mongoose')
  const jwt=require('jsonwebtoken')
  app.set('view engine', 'ejs')
  const environment = 'test';
  require('dotenv').config()
  const multer=require('multer')
  const Store=require('./models/Store')
  const Medicine = require('./models/Medicine')
  const Categories=require('./models/Categories')
  const Signupmodel=require('./models/Signupmodel')
  const Orders=require('./models/Orders')
  const authenticateToken = require('./auth/Authtoken')
  const APIKEY = 'sk_test_f2c71386864743ac7450134fc0e65b7ae3fc588a';
  const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        // Set the destination folder for uploaded files
        cb(null, 'uploads/');
      },
      filename: function (req, file, cb) {
        // Set the filename for uploaded files
        cb(null, Date.now() + '-' + file.originalname);
      }
    })

    const upload = multer({
      storage: storage,
      limits: { files: 5 } // Set the maximum number of files allowed to 5
    })
app.post('/signup',(req,res)=>{
  try{
  const {firstname,lastname,email,address,password}=req.body
  const model=new Signupmodel ({
    firstname,
lastname,
email,
address,
password
  })
  model.save()
  res.status(200).json(model)
  }
  catch(e){
    res.status(500).json(e)
  }
})
app.get('/medicinelist', async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
})
app.put('/medicines/:id', async (req, res) => {
  const { id } = req.params;
  const { price, stock } = req.body;

  try {
    const updatedMedicine = await Medicine.findByIdAndUpdate(id, { price, stock }, { new: true });
    res.json(updatedMedicine);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
})
app.post('/login', async (req, res) => {
  const det = await Signupmodel.findOne({
    email: { $regex: new RegExp(req.body.email, 'i') },
    password: req.body.password
  });
    if (!det) {
      res.status(404).json({ error: 'wrong username or password' });
    } else {
        
      const token = jwt.sign({ userId: det._id }, secretKey, { expiresIn: '1h' });
      res.json({ token });
        dat=det.email
  
    }
  })
  app.get('/distance', async (req, res) => {
    const { address } = req.query;
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=Jabi+Lake+Mall+Abuja+Nigeria&destinations=${encodeURIComponent(address)}&key=AIzaSyDgJuOfGh6ySlwdg1TssD3lGnrDSgeVPqE`);
      const data = response.data;
      if (data.rows[0].elements[0].status === 'OK') {
        const distanceInMeters = data.rows[0].elements[0].distance.value;
        const distanceInKilometers = distanceInMeters / 1000; // Convert meters to kilometers
        const deliveryFeePerKilometer = 100  // Set this to your preferred rate in NGN
        const deliveryFee = distanceInKilometers * deliveryFeePerKilometer;
        const totalAmount =  deliveryFee; // Ensure price is a number before adding
        res.json({ totalAmount });
      } else {
        res.status(500).json({ error: 'Unable to calculate distance' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error occurred while fetching data' });
    }
});
app.get('/admin',async(req,res)=>{
  try{
    const data=await Orders.find({paid:'yes',delivered:'No'})
    res.status(200).json(data)
  }
  catch(e){res.status(500).json(e)}
})
app.get('/data/:id', async (req, res) => {
  try {
    // Retrieve the _id from the request parameters
    const { id } = req.params;

    // Fetch the data based on the provided _id
    const data = await Medicine.findById(id);

    // Return the data as a response
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})

  app.get('/dashboard', authenticateToken, async (req, res) => {
    const userId = req.userId;
  
    const house = await Signupmodel.findById(userId);
  
    if (!house) {
      res.status(404).json({ error: 'details not found' });
    } else {
      res.json(house);
    }
  })
  app.post('/upload', upload.array('images', 5),(req,res)=>{
  const {
      name,description,stock,category, subcategory,price
  }=req.body
  const images = req.files.map((file) => file.path);
  const medicine=new Medicine({
      name,description,stock,category, subcategory,images,price

  }) 
   medicine.save()
  .then(() => {
    res.status(200).json({ok:'med data saved successfully'});
  })
  .catch((error) => {
    res.status(500).send('Error saving data');
    console.error('Error saving med data:', error);
  })
  })
app.get('/getorder/:email',async (req,res)=>{
  try{
const data=await Orders.find({customeremail:req.params.email, paid:'No'})
res.status(200).json(data)
}
catch(e){
  res.status(500).json(e)
}

})
const paystack = new PayStack(APIKEY, environment)
app.get('/chg/:email/:total', (req, res) => {
  const email = req.params.email;
  const total = req.params.total;
 

  // Render the paystack template and pass the email and total variables as data
  res.render('paystack', { email, total })
});

app.post('/ordernumbers/:email/:total', async (req, res) => {
  const {newArray} = req.body;
  const {email, total} = req.params;

  try {
    const data = await Store.findOneAndUpdate(
      {email, total}, // find a document with that filters
      {newArray}, // document to insert when nothing was found
      {upsert: true, new: true, runValidators: true}, // options
    );
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json(e);
  }
});
app.put('/deliver/:id',async(req,res)=>{
  try{
    const data=await Orders.findOne({_id:req.params.id})

    data.delivered='Yes'

    data.save()

    res.status(200).json(data)
  }
  catch(e){
    res.status(500).json(e)
    console.log(e)
  }
})

app.delete('/deleteOrder/:id',async(req,res)=>{
  try{
    const data= await Orders.findByIdAndDelete({_id:req.params.id})
    res.status(200).json({success: 'deleted'})
  }
  catch(e){
    res.status(500).json(e)
  }
})

app.post('/charge', async (req, res) => {
  try {
    // Log the payment details received from Paystack
    const datas = await Store.findOne({ email: req.body.email, total: req.body.total / 100 });

    if (req.body.paymentResponse.status === 'success') {
      const orderNumbers = datas.newArray.map(order => order.orderNumber);

      const data = await Orders.find({ customeremail: req.body.email, orderNumber: { $in: orderNumbers } });

      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          data[i].paid = 'yes';
          await data[i].save();

          // Subtract the quantity from Medicine stock record
          const medname = data[i].medname;
          const quantity = data[i].quantity;

          // Find the Medicine record by medname
          const medicine = await Medicine.findOne({ name: medname });
          if (medicine) {
            medicine.stock -= quantity;
            await medicine.save();
          }
        }

        res.json({ success: true, message: 'Payment details received, data saved, and stock updated' });
      } else {
        res.status(400).json({ success: false, message: 'No matching order found in the database' });
      }
    } else {
      res.status(400).json({ success: false, message: 'Payment error' });
    }
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ success: false, message: 'Error saving data and updating stock' });
  }
});


  app.post('/categ',async(req,res)=>{
    try{
      const data = await Medicine.find({ subcategory: req.body.key, stock: { $gt: 0 } });

      res.status(200).json(data)
    }
    catch(e){
      res.status(500).json(e)
    }
  })

app.get('/ordercount/:email', async (req, res) => {
    try {
        const count = await Orders.countDocuments({customeremail:req.params.email, paid:'No'});
        res.json({count});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
app.post('/order', async (req, res) => {
  try {
    const { medname, category, subcategory, amount, email, customeraddress, quantity, orderNumber, phoneNumber,price } = req.body;

    // Search for existing orders with the given medname and unpaid status
    const existingOrder = await Orders.findOne({ medname, customeremail: email, paid: 'No' });

    if (existingOrder) {
      // Add the quantity to the existing order's quantity
     

      // Check the Medicine record for available stock
      const medicine = await Medicine.findOne({ name:medname });
      if (medicine && medicine.stock >= existingOrder.quantity) {
        // Successful order
        existingOrder.quantity += quantity;
        await existingOrder.save();
        res.status(200).json(existingOrder);
      } else {
        // Not enough stock
        res.status(400).json({ error: 'Not enough stock available for the order.' });
      }
    } else {
      // Create a new order instance
      const order = new Orders({
        medname,
        category,
        subcategory,
        amount,
        customeremail: email,
        address: customeraddress,
        quantity,
        orderNumber,
        phoneNumber,
        price
      });

      // Check the Medicine record for available stock
      const medicine = await Medicine.findOne({ name:medname });
      if (medicine && medicine.stock >= quantity) {
        // Successful order
        await order.save();
        res.status(200).json(order);
      } else {
        // Not enough stock
        res.status(400).json({ error: 'Not enough stock available for the order.' });
      }
    }
  } catch (e) {
    res.status(500).json(e);
  }
});


  app.post('/search', async (req, res) => {
    const { searchTerm } = req.body;
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
        { subcategory: { $regex: searchTerm, $options: 'i' } },
      ],
    });

    res.json(medicines);
  });

  app.post('/result/:key',async(req,res)=>{
    try{
      const data=await Medicine.findOne({_id:req.params.key})
      res.status(200).json(data)
    }
    catch(e){
      res.status(500).json(e)
    }
  })

  app.get('/api/search', async (req, res) => {
    try {
        const term = req.query.term;
        if (!term) {
            return res.status(400).json({ message: "Missing search term" });
        }

        const results = await Medicine.find({
            $or: [
                { name: { $regex: term, $options: 'i' }},
                { category: { $regex: term, $options: 'i' }},
                { subcategory: { $regex: term, $options: 'i' }}
            ]
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  });

  app.put('/collapse/:key',async(req,res)=>{
  const data=await Categories.findOne({_id:req.params.key})
  data.collapse=!data.collapse
  data.save()
  .then(()=>{
    res.status(200).json(data)
  })
  .catch((error) => {
    res.status(500).send('Error saving  data');
    console.error('Error saving med data:', error);
  })
  })
  app.get('/meds',(req,res)=>{
      res.sendFile(__dirname+"/form.html")
  })
  app.get('/home',async(req,res)=>{
    const data=await Categories.find()
    res.json(data)
  })

  app.post('/cat',async(req,res)=>{
  const {name, subCategory}=req.body
  const cat=new Categories({
      name,subCategory,collapse:false
  })
  cat.save()
  .then(() => {
    res.status(200).send('category data saved successfully');
  })
  .catch((error) => {
    res.status(500).send('Error saving  data');
    console.error('Error saving  data:', error);
  })
  })

  app.get("/ind/:name", function(req, res) {
    const {name}=req.params
    res.sendFile(__dirname +'/uploads' +"/"+ name);
  })

  app.listen(4000,()=>{
      console.log(`Worker ${process.pid} started`);
  })

  async function connectToMongoDB() {
      try {
        await mongoose.connect(process.env.URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
        // Continue with your code after successful connection
      } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        // Handle error
      }
  }
  connectToMongoDB()

