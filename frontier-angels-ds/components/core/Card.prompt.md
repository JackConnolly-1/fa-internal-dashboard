Container surface for portfolio companies, deals, team bios, and content blocks.

```jsx
<Card variant="default" hoverable>
  <h3>Acme Corp</h3>
  <p>Series A · FinTech</p>
</Card>

<Card variant="navy" padding="lg">
  <h2 style={{color:'#fff'}}>Fund 5 is Open</h2>
</Card>

<Card variant="featured">
  <Badge variant="gold">Featured Deal</Badge>
  <h3>Startup Name</h3>
</Card>
```

**Variants:** `default` | `navy` | `navy-subtle` | `gold` | `gold-subtle` | `outline` | `featured`
**Props:** `padding` (none/sm/md/lg), `shadow` (none/sm/md/lg), `hoverable`, `onClick`
