import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Grid,
  Snackbar,
} from "@mui/material";
import {  Delete, Edit } from "@mui/icons-material";
import { database, ref, set, push, get, update, remove } from "./firebase";
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';  // Use MUI v5 styling

const useStyles = styled((theme) => ({
  snackbar: {
    position: 'fixed',
    top: '10%', // Adjust as needed to move it higher
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1400, // Ensure it is above other elements
    display: 'flex',
    justifyContent: 'center',
    '& .MuiAlert-root': {
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: 'auto',
      },
    },
  },
}));




const MenuManagement = () => {
  const classes = useStyles();
  const [menuItems, setMenuItems] = useState([]);
  const [item, setItem] = useState({
    category: "",
    name: "",
    options: "",
    price: "",
    cost: "",
    amountInStock: "",
  });
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const dbRef = ref(database, "menuItems");
    const snapshot = await get(dbRef);
    if (snapshot.exists()) {
      const data = snapshot.val();
      const items = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setMenuItems(items);
    } else {
      console.log("No data available");
    }
  };

  const handleChange = (e) => {
    setItem({
      ...item,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // Check if all fields have values
    if (!item.category || !item.name || !item.options || !item.price || !item.cost || !item.amountInStock) {
      setSnackbarMessage("Please fill in all fields before submitting");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }
    if (isEdit) {
      const itemRef = ref(database, `menuItems/${currentId}`);
      await update(itemRef, item);
      setIsEdit(false);
      setCurrentId(null);
      setSnackbarMessage("Item updated successfully");
      setSnackbarSeverity("info");
    } else {
      const newItemRef = push(ref(database, "menuItems"));
      await set(newItemRef, item);
      setSnackbarMessage("Item added successfully");
      setSnackbarSeverity("success");
    }
    fetchData();
    setItem({
      category: "",
      name: "",
      options: "",
      price: "",
      cost: "",
      amountInStock: "",
    });
    setSnackbarOpen(true);
  };

  const handleEdit = (item) => {
    setItem(item);
    setIsEdit(true);
    setCurrentId(item.id);
  };

  const handleDelete = async (id) => {
    const itemRef = ref(database, `menuItems/${id}`);
    await remove(itemRef);
    fetchData();
    setSnackbarMessage("Item deleted successfully");
    setSnackbarSeverity("error");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <h1>Menu Management</h1>
      <form noValidate autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={item.category}
                onChange={handleChange}
              >
                <MenuItem value="Starter">Starter</MenuItem>
                <MenuItem value="Main Course">Main Course</MenuItem>
                <MenuItem value="Dessert">Dessert</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              margin="normal"
              value={item.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Options</InputLabel>
              <Select
                name="options"
                value={item.options}
                onChange={handleChange}
              >
                <MenuItem value="Small">Small</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Large">Large</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              name="price"
              fullWidth
              margin="normal"
              type="number"
              value={item.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Cost"
              name="cost"
              fullWidth
              margin="normal"
              type="number"
              value={item.cost}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Amount in Stock"
              name="amountInStock"
              fullWidth
              margin="normal"
              type="number"
              value={item.amountInStock}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              fullWidth
            >
              {isEdit ? "Update" : "Add"} Item
            </Button>
          </Grid>
        </Grid>
      </form>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Options</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Amount in Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menuItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.options}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.cost}</TableCell>
                <TableCell>{item.amountInStock}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        className={classes.snackbar}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default MenuManagement;
