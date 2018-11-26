import React from "react"
import {Link} from "gatsby"
import {I18nextProvider, withNamespaces} from "react-i18next"
import {
  Backdrop,
  Block,
  Box,
  Button,
  List,
  Heading,
  Provider as ReakitProvider,
  Portal,
  Sidebar,
  Toolbar,
  styled,
} from "reakit"
import {FiMenu, FiX} from "react-icons/fi"

import {createGlobalStyle, ThemeProvider} from "styled-components"

import theme from "~/utils/theme"
import i18n from "~/utils/i18n"
import {EnFlag, FrFlag} from "~/utils/flags"

const HeaderButton = styled(Button)`
  background: white;
  color: #000;
`

const SidebarButton = styled(Button)`
  border-radius: 0;
  background-color: white;
  color: ${theme.palette.text};
  height: 100px;
  font-size: 25px;
  padding: 0 30px;
  width: 100%;
`

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Quicksand;
    color: ${theme.palette.text};
    margin: 0;
  }

  a:-webkit-any-link {
    text-decoration: none;
  }
`

const SidebarContent = withNamespaces()(({onSelect, sidebar, t}) => (
  <>
    <Toolbar.Content margin="8px 16px">
      <HeaderButton use={Sidebar.Hide} {...sidebar}>
        <Toolbar.Focusable fontSize={20}>
          <FiX />
        </Toolbar.Focusable>
      </HeaderButton>
    </Toolbar.Content>
    <List>
      <li>
        <Link to="/" onClick={onSelect}>
          <SidebarButton>{t("sidebar.activities")}</SidebarButton>
        </Link>
      </li>
      <li>
        <Link to="/heatmap" onClick={onSelect}>
          <SidebarButton>{t("sidebar.heatmap")}</SidebarButton>
        </Link>
      </li>
      <li>
        <Link to="/map" onClick={onSelect}>
          <SidebarButton>{t("sidebar.map")}</SidebarButton>
        </Link>
      </li>
    </List>
  </>
))

const Layout = ({children, data, ...props}) => (
  <>
    <GlobalStyle />
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <ReakitProvider theme={theme}>
          <Sidebar.Container>
            {sidebar => (
              <Block {...props}>
                <Toolbar background="white" gutter="8px 16px">
                  <Toolbar.Content>
                    <HeaderButton use={Sidebar.Show} {...sidebar}>
                      <Toolbar.Focusable fontSize={20}>
                        <FiMenu />
                      </Toolbar.Focusable>
                    </HeaderButton>
                  </Toolbar.Content>
                  <Toolbar.Content align="center" autoColumns="auto">
                    <Link to="/">
                      <Heading
                        use="h1"
                        fontSize={24}
                        fontWeight="bold"
                        margin={0}
                        palette="primary"
                        whiteSpace="nowrap"
                      >
                        {"CeD in Sport"}
                      </Heading>
                    </Link>
                  </Toolbar.Content>
                  <Toolbar.Content align="end">
                    <HeaderButton>
                      <FrFlag
                        height={20}
                        onClick={() => i18n.changeLanguage("fr")}
                      />
                    </HeaderButton>
                    <HeaderButton>
                      <EnFlag
                        height={20}
                        onClick={() => i18n.changeLanguage("en")}
                      />
                    </HeaderButton>
                  </Toolbar.Content>
                </Toolbar>
                <Box minHeight="calc(100vh - 56px)">{children}</Box>
                <Backdrop fade use={[Portal, Sidebar.Hide]} {...sidebar} />
                <Sidebar use={Portal} slide {...sidebar}>
                  <SidebarContent
                    sidebar={sidebar}
                    onSelect={() => sidebar.hide()}
                  />
                </Sidebar>
              </Block>
            )}
          </Sidebar.Container>
        </ReakitProvider>
      </ThemeProvider>
    </I18nextProvider>
  </>
)

export default Layout
