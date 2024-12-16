import {OnlyChildrenProps} from "../types/generic.ts";
import {UserContext} from "../context/UserContext.tsx";
import {useContext, useEffect, useState} from "react";
import {Text} from "@mantine/core"
import {UserFetchingStatus} from "../types/enum.ts";
import {useNavigate} from "react-router-dom";

const RequiresLogin: React.FC<OnlyChildrenProps> = (props: OnlyChildrenProps) => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    switch (userContext.fetchStatus) {
      case UserFetchingStatus.DONE:
        if(userContext.isLoggedIn) {
          setRendering(true);
        }
        else {
          navigate("/login", { replace: true });
        }
        break;
      default: break;
    }
  }, [navigate, userContext.fetchStatus, userContext.isLoggedIn])

  return (
    rendering
    ? (
      <>
        {
          userContext.fetchStatus === UserFetchingStatus.DONE
            ? props.children
            : <Text>Something went wrong. Refresh the page or contact a site administrator.</Text>
        }
      </>
    )
    : null
  )
};

export default RequiresLogin;