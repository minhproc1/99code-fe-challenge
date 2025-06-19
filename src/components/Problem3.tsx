import { Box, Typography, Divider, Paper } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
const codeString = `
function getPriority(blockchain: string): number {
  // ✅ Moved outside component to avoid recreation on every render
  switch (blockchain) {
    case "Osmosis": return 100;
    case "Ethereum": return 50;
    case "Arbitrum": return 30;
    case "Zilliqa":
    case "Neo": return 20;
    default: return -99;
  }
}

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // ✅ Added missing field
}

export function WalletPage(props: Props): JSX.Element {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .map((balance) => ({
        ...balance,
        priority: getPriority(balance.blockchain), // ✅ compute once
      }))
      .filter((b) => b.priority > -99 && b.amount > 0) // ✅ fixed filtering logic
      .sort((a, b) => b.priority - a.priority);
  }, [balances]);

  const rows = useMemo(() => {
    return sortedBalances.map((balance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          key={balance.currency} // ✅ use stable key
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.amount.toFixed()}
        />
      );
    });
  }, [sortedBalances, prices]); // ✅ memoized rows for perf

  return <div {...rest}>{rows}</div>;
}`;
export default function Problem3() {
  return (
    <Box maxWidth="md" mx="auto" my={4} px={2}>
      <Typography variant="h5" gutterBottom>
        🛠️ Problem 3: Refactoring Walkthrough
      </Typography>

      <Typography paragraph>
        While reviewing the original <code>WalletPage</code> component, I
        noticed several inefficiencies and anti-patterns that could lead to
        performance and maintainability issues.
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        1. <code>getPriority()</code> Redefined on Every Render
      </Typography>
      <Typography paragraph>
        The <code>getPriority</code> function was defined inside the component,
        meaning it was recreated every render — causing unnecessary
        re-computation and breaking memoization. I moved it outside the
        component to fix that.
      </Typography>

      <Typography variant="h6" gutterBottom>
        2. Invalid Logic in <code>filter()</code>
      </Typography>
      <Typography paragraph>
        There was a bug using <code>lhsPriority</code> which was undefined —
        probably meant <code>balancePriority</code>. Also, it filtered for
        tokens with amount <strong>less than or equal to 0</strong>, which
        doesn’t make sense in a wallet display. I corrected the logic to include
        only positive balances.
      </Typography>

      <Typography variant="h6" gutterBottom>
        3. Double Use of <code>getPriority()</code>
      </Typography>
      <Typography paragraph>
        The same function was called twice: once in <code>filter</code> and
        again in <code>sort</code>. Instead, I precomputed it in a{" "}
        <code>.map()</code> call and used it in both operations, making the code
        DRY and more efficient.
      </Typography>

      <Typography variant="h6" gutterBottom>
        4. Key Prop Issue
      </Typography>
      <Typography paragraph>
        The <code>key</code> in the React list used the index, which can lead to
        bugs if the order changes. I updated it to use the unique{" "}
        <code>currency</code> instead.
      </Typography>

      <Typography variant="h6" gutterBottom>
        5. Dead Code & Missing Types
      </Typography>
      <Typography paragraph>
        The <code>formattedBalances</code> variable was declared but never used.
        I removed it, and I also added the missing <code>blockchain</code> field
        to the <code>WalletBalance</code> interface.
      </Typography>

      <Typography variant="h6" gutterBottom>
        6. Performance: Memoized <code>rows</code>
      </Typography>
      <Typography paragraph>
        I wrapped the <code>rows</code> computation in <code>useMemo</code> so
        that it only re-renders when the input data changes — important if the
        wallet grows large.
      </Typography>

      <Divider sx={{ my: 3 }} />
      <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
        <SyntaxHighlighter
          language="tsx"
          style={vscDarkPlus}
          wrapLongLines
          customStyle={{ fontSize: "16px", lineHeight: "1.4", padding: 0 }}
          codeTagProps={{ style: { fontSize: "16px" } }}
        >
          {codeString}
        </SyntaxHighlighter>
      </Paper>
    </Box>
  );
}
