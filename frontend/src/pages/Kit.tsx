// src/pages/Kit.tsx
import { Box, Container, TextField, Button, Switch, FormControlLabel, Typography, Paper } from "@mui/material";

export default function Kit() {
  return (
    <Box sx={{ minHeight: "100svh", bgcolor: "background.default", py: 3 }}>
      <Container maxWidth="sm">
        <Typography variant="h6" fontWeight={700} mb={2}>UI Kit</Typography>
        <Paper variant="outlined" sx={{ p: 2, display: "grid", gap: 2 }}>
          <TextField label="Input" placeholder="Placeholder" />
          <FormControlLabel control={<Switch defaultChecked />} label="Switch" />
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained">Primary</Button>
            <Button variant="outlined">Outlined</Button>
            <Button variant="text">Text</Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}