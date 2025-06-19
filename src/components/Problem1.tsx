import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

type ImplementationKey = "A" | "B" | "C";

const MAX_SAFE_N = Math.floor(Math.sqrt(Number.MAX_SAFE_INTEGER * 2));
const schema = z.object({
  n: z
    .string()
    .refine((val) => /^-?\d+$/.test(val), {
      message: "Only integers allowed",
    })
    .refine((val) => Math.abs(Number(val)) <= MAX_SAFE_N, {
      message: `Value too large. Use absolute value ≤ ${MAX_SAFE_N}`,
    }),
});
type FormData = z.infer<typeof schema>;

const sum_to_n_a = (n: number): number => {
  let sum = 0;
  for (let i = 1; i <= Math.abs(n); i++) sum += i;
  return n < 0 ? -sum : sum;
};

const sum_to_n_b = (n: number): number => {
  const absN = Math.abs(n);
  const sum = (absN * (absN + 1)) / 2;
  return n < 0 ? -sum : sum;
};

const sum_to_n_c = (n: number): number => {
  const abs = Math.abs(n);
  const recurse = (x: number): number => (x === 0 ? 0 : x + recurse(x - 1));
  const sum = recurse(abs);
  return n < 0 ? -sum : sum;
};

const implementations: Record<ImplementationKey, (n: number) => number> = {
  A: sum_to_n_a,
  B: sum_to_n_b,
  C: sum_to_n_c,
};

const implementationCode: Record<ImplementationKey, string> = {
  A: `const sum_to_n_a = (n: number): number => {
  let sum = 0;
  for (let i = 1; i <= Math.abs(n); i++) sum += i;
  return n < 0 ? -sum : sum;
};`,
  B: `const sum_to_n_b = (n: number): number => {
  const absN = Math.abs(n);
  const sum = (absN * (absN + 1)) / 2;
  return n < 0 ? -sum : sum;
};`,
  C: `const sum_to_n_c = (n: number): number => {
  const abs = Math.abs(n);
  const recurse = (x: number): number =>
    (x === 0 ? 0 : x + recurse(x - 1));
  const sum = recurse(abs);
  return n < 0 ? -sum : sum;
};`,
};

export default function SumToNVisualizer() {
  const [implKey, setImplKey] = useState<ImplementationKey>("A");
  const [result, setResult] = useState<number | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ n }: FormData) => {
    try {
      setLoading(true);

      const num = parseInt(n);
      const fn = implementations[implKey];

      const start = performance.now();
      const output = fn(num);
      const end = performance.now();
      setResult(output);
      setTimeTaken(end - start);
    } catch (error) {
      setResult(null);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(String(error));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangeImpl = (event: SelectChangeEvent) => {
    setImplKey(event.target.value as ImplementationKey);
  };

  return (
    <Grid container spacing={2}>
      <Grid size={4}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6">Sum to n Visualizer</Typography>
          <Box
            mt={2}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <TextField
              label="Enter a number"
              fullWidth
              {...register("n")}
              error={!!errors.n}
              helperText={errors.n?.message}
            />

            <Box mt={2}>
              <FormControl fullWidth>
                <InputLabel>Implementation</InputLabel>
                <Select
                  value={implKey}
                  onChange={handleChangeImpl}
                  label="Implementation"
                >
                  <MenuItem value="A">Loop</MenuItem>
                  <MenuItem value="B">Formula</MenuItem>
                  <MenuItem value="C">Recursive</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box mt={2}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : "Calculate"}
              </Button>
            </Box>
          </Box>

          {result !== null && (
            <Box mt={3}>
              <Typography>
                Result: <strong>{result}</strong>
              </Typography>
              <Typography>
                Time Taken: <strong>{timeTaken?.toFixed(4)} ms</strong>
              </Typography>
            </Box>
          )}
          {error && (
            <Box mt={3}>
              Error: <strong>{error}</strong>
            </Box>
          )}
        </Paper>
      </Grid>

      <Grid size={8}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            bgcolor: "#1e1e1e",
            color: "#fff",
            fontFamily: "monospace",
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Code for Implementation {implKey}
          </Typography>
          <Box component="pre" sx={{ whiteSpace: "pre-wrap" }}>
            {implementationCode[implKey]}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}
