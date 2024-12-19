import {CheckLoginProps} from "../types/generic.ts";
import {UserContext} from "../context/UserContext.tsx";
import React, {useContext, useEffect, useState} from "react";
import {Box, LoadingOverlay, Text} from "@mantine/core"
import {FetchingStatus} from "../types/enum.ts";
import {useLocation, useNavigate} from "react-router-dom";

const CheckLogin: React.FC<CheckLoginProps> = (props: CheckLoginProps) => {
  const path = useLocation();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [fetchedOnce, setFetchedOnce] = useState(false);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    switch (userContext.fetchStatus) {
      case FetchingStatus.DONE:
        if(userContext.isLoggedIn) {
          setRendering(true);
          setFetchedOnce(true);
        }
        else {
          if(fetchedOnce || !props.checkOnce) {
            navigate("/login?redirect=" + (props.redirect ? path : ""), { replace: true });
          }
        }
        break;
      default: break;
    }
  }, [navigate, props, userContext.fetchStatus, userContext.isLoggedIn])

  return (
    rendering
    ? (
      <>
        {
          (props.checkOnce && fetchedOnce) || userContext.fetchStatus === FetchingStatus.DONE
            ? props.children
            : <Text>Something went wrong when fetching user. Refresh the page or contact a site administrator.</Text>
        }
      </>
    )
    : <Box w={"100%"} h={"100%"} pos="relative">
        <LoadingOverlay
          visible zIndex={10}
          overlayProps={{ blur: 1, color: "#444", opacity: 0.8 }}/>
      </Box>
  )
};

export default CheckLogin;