import styles from "./index.module.css";
import Header from "./header";
import Body from "./body";
import Footer from "./footer";

const Home = () => {
  return (
    <div className={styles.home}>
      <Header />
      <Body />
      <Footer />
    </div>
  );
};

export default Home;
