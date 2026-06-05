/**
 * PageShell — wraps every page with TrustBar + Navbar + Footer.
 * Eliminates the repeated import + JSX pattern in every page file.
 */
import TrustBar from "./TrustBar";
import Navbar   from "./Navbar";
import Footer   from "./Footer";
import { C }    from "../tokens";

export default function PageShell({ children, background }) {
  return (
    <div style={{ minHeight:"100vh", background: background ?? C.bg, display:"flex", flexDirection:"column" }}>
      <TrustBar />
      <Navbar />
      <div style={{ flex:1 }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}
