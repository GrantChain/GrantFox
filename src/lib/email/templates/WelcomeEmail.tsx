import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Button,
  Img,
} from "@react-email/components";
import * as React from "react";

export type WelcomeEmailProps = {
  userName?: string;
  ctaUrl?: string;
  ctaText?: string;
  logoUrl?: string;
  extraText?: string;
};

const styles = {
  background: "#fff",
  color: "#000",
};
const cardStyle = {
  background: "#fff",
  borderRadius: 8,
  padding: 24,
  maxWidth: 480,
  margin: "40px auto",
  border: "1px solid #e5e7eb",
};
const mutedStyle = { color: "#000" };
const buttonStyle = {
  display: "inline-block",
  padding: "12px 32px",
  background: "hsl(15, 90%, 55%)",
  color: "#fff",
  borderRadius: 4,
  textDecoration: "none",
  fontWeight: 600,
};

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  userName = "there!",
  ctaUrl = "https://github.com/GrantChain/GrantFox",
  ctaText = "Visit GrantFox",
  logoUrl = "https://avatars.githubusercontent.com/u/199653906?s=200&v=4",
  extraText = "",
}) => (
  <Html>
    <Head />
    <Body
      style={styles as React.CSSProperties}
    >
      <Container
        style={cardStyle as React.CSSProperties}
      >
        <Section style={{ textAlign: "center" }}>
          <Img src={logoUrl} alt="GrantFox Logo" width={80} height={80} style={{ margin: "0 auto 16px" }} />
          <Heading as="h2" style={{ margin: "0 0 16px", color: "#000" }}>Welcome, {userName}!</Heading>
          <Text style={{ margin: "0 0 16px", color: "#000" }}>
            This is a sample rich email template. You can add images, text, links, and more.
          </Text>
          {extraText && <Text style={{ margin: "0 0 16px", color: "#000" }}>{extraText}</Text>}
          <Button
            href={ctaUrl}
            style={buttonStyle as React.CSSProperties}
          >
            {ctaText}
          </Button>
        </Section>
        <Section style={{ marginTop: 32, fontSize: 12, textAlign: "center", ...mutedStyle }}>
          <Text style={{ color: "#000" }}>
            If you wish to unsubscribe, <a href="https://github.com/GrantChain/GrantFox" style={mutedStyle}>click here</a>.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeEmail;