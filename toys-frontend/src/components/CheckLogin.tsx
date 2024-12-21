import {CheckLoginProps} from "../types/generic.ts";
import {UserContext} from "../context/UserContext.tsx";
import React, {useContext, useEffect, useState} from "react";
import {Box, LoadingOverlay} from "@mantine/core"
import {FetchingStatus} from "../types/enum.ts";
import {useLocation, useNavigate} from "react-router-dom";

const CheckLogin: React.FC<CheckLoginProps> = (props: CheckLoginProps) => {
  const path = useLocation();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [fetchedOnce, setFetchedOnce] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [validRole, setValidRole] = useState(false);
  const [auth, setAuth] = useState("");

  useEffect(() => {
    if (userContext.fetchStatus === FetchingStatus.DONE) {
      if(auth.length === 0) {
        if(userContext.isLoggedIn) {
          setAuth(userContext.authToken);
          setFetchedOnce(true);
          setValidRole(props.acceptedRoles?.includes(userContext.user.role) ?? true);
          setRendering(true);
        }
        else if(props.required) {
          if(!fetchedOnce || !props.dontRerender) {
            navigate("/login?redirect=" + (props.redirect ? path.pathname : ""), { replace: true });
          }
        }
        else {
          setRendering(true);
        }
      }
      else {
        if(auth !== userContext.authToken) {
          setRendering(false);
          setFetchedOnce(false);
          setValidRole(false);
          setAuth(userContext.authToken ?? "");
        }
      }
    }
  }, [navigate, path.pathname, props, userContext.authToken, userContext.fetchStatus, userContext.isLoggedIn])

  return (
    rendering
    ? (
      <>
        {
          (props.dontRerender && fetchedOnce) || userContext.fetchStatus === FetchingStatus.DONE
            ?
            validRole
              ?
              props.children
              : props.required
                ?
                (() => {
                  throw new Error("User does not have permission to access this page.");
                })()
                : null
            :
            props.required
              ?
              (() => {
                throw new Error("Something went wrong when fetching user. Refresh the page or contact a site administrator.")
              })()
              : null
        }
      </>
    )
    : <Box w={"100%"} h={"100vh"} pos="absolute">
        <LoadingOverlay
          visible zIndex={10}
          overlayProps={{ blur: 1, color: "#444", opacity: 0.8 }}/>
      </Box>
  )
};

export default CheckLogin;