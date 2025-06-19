import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";

type PriceEntry = {
  currency: string;
  date: string;
  price: number;
};
type PriceMap = Record<string, number>;

const schema = z
  .object({
    fromAmount: z.coerce.number().positive("Amount must be positive"),
    fromToken: z.string().min(1, "Select a token"),
    toToken: z.string().min(1, "Select a token"),
  })
  .refine((data) => data.fromToken !== data.toToken, {
    message: "Cannot swap the same token",
    path: ["toToken"],
  });

export default function Problem2() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [tokenList, setTokenList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fromAmount: 0,
      fromToken: "",
      toToken: "",
    },
  });

  useEffect(() => {
    fetch("https://interview.switcheo.com/prices.json")
      .then((res) => res.json())
      .then((data: PriceEntry[]) => {
        const latestPrices = getLatestPrices(data);
        setPrices(latestPrices);
        const sortedTokens = Object.keys(latestPrices).sort();
        setTokenList(sortedTokens);
      })
      .catch(() => {
        setPrices({});
        setTokenList([]);
      });
  }, []);

  function onSubmit({ fromAmount, fromToken, toToken }: any) {
    if (!prices[fromToken] || !prices[toToken]) {
      setResult("Missing price data");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const rate = prices[fromToken] / prices[toToken];
      setResult(`${(fromAmount * rate).toFixed(4)} ${toToken}`);
      setLoading(false);
    }, 1000);
  }

  function getLatestPrices(data: PriceEntry[]): PriceMap {
    const latest = new Map<string, { date: string; price: number }>();

    data.forEach((entry) => {
      const existing = latest.get(entry.currency);
      if (!existing || new Date(entry.date) > new Date(existing.date)) {
        latest.set(entry.currency, { date: entry.date, price: entry.price });
      }
    });

    const normalized: PriceMap = {};
    for (const [currency, { price }] of latest) {
      normalized[currency] = price;
    }

    return normalized;
  }

  function getTokenIconUrl(symbol: string): string {
    return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${symbol}.svg`;
  }

  function renderMenuItem(symbol: string) {
    return (
      <MenuItem key={symbol} value={symbol}>
        <Box display="flex" alignItems="center">
          <img
            src={getTokenIconUrl(symbol)}
            alt={symbol}
            width={20}
            height={20}
            style={{ marginRight: 8 }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <span>{symbol}</span>
        </Box>
      </MenuItem>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid sx={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Currency Swap
                </Typography>

                <Controller
                  name="fromAmount"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Amount"
                      fullWidth
                      margin="normal"
                      type="number"
                      {...field}
                      error={!!errors.fromAmount}
                      helperText={errors.fromAmount?.message}
                    />
                  )}
                />

                <Controller
                  name="fromToken"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="From"
                      fullWidth
                      margin="normal"
                      {...field}
                      error={!!errors.fromToken}
                      helperText={errors.fromToken?.message}
                    >
                      {tokenList.map((symbol) => renderMenuItem(symbol))}
                    </TextField>
                  )}
                />

                <Controller
                  name="toToken"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="To"
                      fullWidth
                      margin="normal"
                      {...field}
                      error={!!errors.toToken}
                      helperText={errors.toToken?.message}
                    >
                      {tokenList.map((symbol) => renderMenuItem(symbol))}
                    </TextField>
                  )}
                />

                <Box textAlign="right" mt={2}>
                  <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Swap"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid sx={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">Result</Typography>
                <Typography mt={2}>
                  {result ? (
                    <Box display="flex" alignItems="center">
                      <img
                        src={getTokenIconUrl(result.split(" ")[1])}
                        alt={result.split(" ")[1]}
                        width={20}
                        height={20}
                        style={{ marginRight: 8 }}
                        onError={(e) =>
                          (e.currentTarget.style.display = "none")
                        }
                      />
                      <span>{result}</span>
                    </Box>
                  ) : (
                    "Enter values to see result"
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
}
