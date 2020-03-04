import { CssBaseline, isWidthUp, withWidth } from '@material-ui/core';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';
import React, { lazy, Suspense, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Navigator from './components/Navigator';
import Product from './components/products/Product';
import ProductContext, { defaultProductContext } from './components/products/ProductContext';
import AppContext, { defaultAppContext } from './context/AppContext';
import Header from './Header';
// Lazy Pages
const ProductPage = lazy(() => import('./components/products/ProductPage'));

interface Props {
  width: Breakpoint
}

interface State {
  navDrawerOpen: boolean
}

class App extends React.Component<Props, State> {

  state = {
    navDrawerOpen: false
  };

  handleDrawerToggle() {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    });
  }

  render() {

    let { navDrawerOpen } = this.state;
    const paddingLeftDrawerOpen = 236;
    const notMobile = isWidthUp('sm', this.props.width);

    const styles = {
      header: {
        paddingRight: notMobile && navDrawerOpen ? paddingLeftDrawerOpen : 0
      },
      body: {
        margin: '80px 20px 20px 15px',
        paddingLeft: notMobile ? paddingLeftDrawerOpen + 15 : 0
      },
    };

    return (
      <>
        <CssBaseline />
        <Router>
          {
            // TODO: Remove the testing
          }
          <AppContext.Provider value={defaultAppContext}>

            <Header handleDrawerToggle={this.handleDrawerToggle.bind(this)} />
            <div onClick={() => !notMobile && this.handleDrawerToggle.bind(this)()}>
              <Navigator handleDrawerToggle={this.handleDrawerToggle.bind(this)} open={navDrawerOpen} />
            </div>
            <body style={styles.body}>
              {
                //  <LoginDialog/>
              }
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                  <Route exact path="/">
                    <Home />
                  </Route>
                  <Route path="/register">
                  </Route>
                  <Route path="/products">
                    <DefaultProductsPage />
                  </Route>
                  <Route path="/campaigns">

                  </Route>
                  <Route path="/customers">

                  </Route>
                  <Route path="/theme">

                  </Route>
                  <Route path="/pages">

                  </Route>
                  <Route path="/demo">

                  </Route>
                  <Route path="/settings">

                  </Route>
                </Switch>
              </Suspense>
            </body>
          </AppContext.Provider>
        </Router >
      </>
    );
  }
}

function DefaultProductsPage() {

  const state = useProductOperations();

  return (
    <ProductContext.Provider value={state}>
      <ProductPage />
    </ProductContext.Provider>
  )
}

export function useProductOperations(initialProducts: Product[] = defaultProductContext.products) {

  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProducts = (newProducts: Product[]) => {
    setProducts([...newProducts, ...products]);
  }

  const deleteProduct = (product: Product) => {
    setProducts(products.filter(p => p !== product));
  }

  const updateProduct = (product: Product) => {
    setProducts(products.map(el => el._id === product._id ? product : el));
  }

  return { products, setProducts, addProducts, deleteProduct, updateProduct }
}


function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}


export default withWidth()(App);
