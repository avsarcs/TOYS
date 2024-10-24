package auth;

import enums.roles.USER_ROLE;

import java.util.HashMap;
import java.util.List;

public class PermissionMap {
    public static HashMap<USER_ROLE, List<Permission>> table = new HashMap<USER_ROLE, List<Permission>>();

    public static boolean hasPermission(USER_ROLE role, Permission permission) {
        initializeEntries();
        boolean hasPermission = table.get(role).contains(permission);
        if (role != USER_ROLE.GUIDE && !hasPermission) {
            hasPermission = table.get(USER_ROLE.ADVISOR).contains(permission);

            if (role != USER_ROLE.ADVISOR && !hasPermission) {
                hasPermission = table.get(USER_ROLE.COORDINATOR).contains(permission);

                if (role != USER_ROLE.COORDINATOR && !hasPermission) {
                    hasPermission = table.get(USER_ROLE.DIRECTOR).contains(permission);
                }
            }
        }
        return hasPermission;
    }

    public static void initializeEntries() {
        if (table.isEmpty()) {
            table.put(USER_ROLE.GUIDE, List.of(
                    Permission.VIEW_FAIR_INFO,
                    Permission.VIEW_TOUR_INFO,
                    Permission.VIEW_TOUR_REVIEW,
                    Permission.RU_FROM_TOUR,
                    Permission.AR_TOUR_AGGINMENT,
                    Permission.REPORT_TOUR_TIMES
            ));

            table.put(USER_ROLE.ADVISOR, List.of(
                    Permission.AR_TOUR_REQUESTS,
                    Permission.AR_TOUR_CHANGES,
                    Permission.REQUEST_TOUR_CHANGES,
                    Permission.ASSIGN_OTHER_GUIDE,
                    Permission.MANAGE_GUIDE_EXPERIENCE
            ));

            table.put(USER_ROLE.COORDINATOR, List.of(
                    Permission.AR_GUIDE_APPLICATIONS,
                    Permission.INVITE_GUIDE_TO_FAIR,
                    Permission.FIRE_GUIDE_OR_ADVISOR,
                    Permission.AR_FAIR_INVITATIONS,
                    Permission.VIEW_WORK_DONE_BY_GUIDE
            ));

            table.put(USER_ROLE.DIRECTOR, List.of(
                    Permission.TOTAL_ANALYTICS_ACCESS
            ));

        }
    }
}
