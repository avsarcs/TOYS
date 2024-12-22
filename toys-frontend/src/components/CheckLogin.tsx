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
  const [rendering, setRendering] = useState(false);
  const [validRole, setValidRole] = useState(false);

  useEffect(() => {
    switch(userContext.profileFetchStatus) {
      case FetchingStatus.DONE:
        if(userContext.isLoggedIn) {
          setValidRole(props.acceptedRoles?.includes(userContext.user.role) ?? true);
          setRendering(true);
        }
        else if(props.required) {
          navigate("/login?redirect=" + (props.redirect ? path.pathname : ""), { replace: true });
        }
        else {
          setRendering(true);
        }
        break;
      case FetchingStatus.FAILED:
        setRendering(true);
    }
  }, [props, userContext.isLoggedIn, userContext.profileFetchStatus, userContext.user.role])

  console.log(userContext);

  return (
    rendering
    ? (
      <>
        {
          userContext.profileFetchStatus === FetchingStatus.DONE
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
            userContext.profileFetchStatus === FetchingStatus.FAILED && props.required
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