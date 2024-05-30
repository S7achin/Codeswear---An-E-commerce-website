"use client";
import {
  Paper,
  Grid,
  Stack,
  TextField,
  Checkbox,
  FormGroup,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
  FormControl,
  Button,
} from "@mui/material";
// import BaseCard from '@/app/(DashboardLayout)/components/shared/BaseCard';
import BaseCard from "../components/shared/BaseCard";
import { useState } from "react";
import { toast } from "react-toastify";

const addProducts = () => {
  const [form, setForm] = useState({});
  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Fetch API Request to add a product
    const data = [form];
    // console.log(data);
    // console.log(JSON.stringify(data));
    const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/addproducts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const msg = await res.json();
    if (res.ok) {
      toast.success(msg.message);
      setForm({});
    } else {
      toast.error("Some error occured!");
    }
    // console.log(msg);
  };
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={12}>
        <BaseCard title="Add a product">
          <>
            <Stack spacing={3}>
              <TextField
                onChange={onChange}
                value={form.title}
                name="title"
                id="title"
                label="Title"
                variant="outlined"
              />
              <TextField
                onChange={onChange}
                value={form.slug}
                name="slug"
                id="slug"
                label="Slug"
                variant="outlined"
              />
              <FormControl onChange={onChange}>
                <FormLabel value={form.category} name="category" id="category">
                  Type
                </FormLabel>
                <RadioGroup aria-labelledby="category" name="category">
                  <FormControlLabel
                    value="tshirt"
                    control={<Radio />}
                    label="Tshirt"
                  />
                  <FormControlLabel
                    value="hoodie"
                    control={<Radio />}
                    label="Hoodie"
                  />
                  <FormControlLabel
                    value="sticker"
                    control={<Radio />}
                    label="Sticker"
                  />
                  <FormControlLabel
                    value="mug"
                    control={<Radio />}
                    label="Mug"
                  />
                </RadioGroup>
              </FormControl>
              <FormControl onChange={onChange}>
                <FormLabel value={form.size} name="size" id="size">
                  Size
                </FormLabel>
                <RadioGroup aria-labelledby="size" name="size">
                  <FormControlLabel value="S" control={<Radio />} label="S" />
                  <FormControlLabel value="M" control={<Radio />} label="M" />
                  <FormControlLabel value="L" control={<Radio />} label="L" />
                  <FormControlLabel value="XL" control={<Radio />} label="XL" />
                  <FormControlLabel
                    value="XXL"
                    control={<Radio />}
                    label="XXL"
                  />
                </RadioGroup>
              </FormControl>
              <TextField
                onChange={onChange}
                value={form.color}
                name="color"
                id="color"
                label="Color"
                variant="outlined"
              />
              <TextField
                onChange={onChange}
                value={form.img}
                name="img"
                id="img"
                label="img"
                variant="outlined"
              />
              <TextField
                onChange={onChange}
                value={form.price}
                name="price"
                id="price"
                label="Price"
                variant="outlined"
              />
              <TextField
                onChange={onChange}
                value={form.availableQty}
                name="availableQty"
                id="availableQty"
                label="Available Quantity"
                variant="outlined"
              />
              <TextField
                id="desc"
                onChange={onChange}
                value={form.desc}
                name="desc"
                label="Description"
                multiline
                rows={2}
              />
            </Stack>
            <br />
            <Button variant="outlined" onClick={handleSubmit}>
              Submit
            </Button>
          </>
        </BaseCard>
      </Grid>
    </Grid>
  );
};

export default addProducts;
