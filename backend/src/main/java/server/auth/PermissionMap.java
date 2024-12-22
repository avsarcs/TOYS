package server.auth;

import server.enums.roles.UserRole;

import java.util.HashMap;
import java.util.List;

public class PermissionMap {
    public static HashMap<UserRole, List<Permission>> table = new HashMap<UserRole, List<Permission>>();

    public static boolean hasPermission(UserRole role, Permission permission) {
        initializeEntries();
        boolean hasPermission = table.get(UserRole.GUIDE).contains(permission);

        if (role != UserRole.GUIDE && !hasPermission) {
            hasPermission = table.get(UserRole.ADVISOR).contains(permission);

            if (role != UserRole.ADVISOR && !hasPermission) {
                hasPermission = table.get(UserRole.COORDINATOR).contains(permission);

                if (role != UserRole.COORDINATOR && !hasPermission) {
                    hasPermission = table.get(UserRole.DIRECTOR).contains(permission);

                    if (role != UserRole.DIRECTOR && !hasPermission) {
                        hasPermission = table.get(UserRole.ADMIN).contains(permission);
                    }
                }
            }
        }


        return hasPermission;
    }

    public static void initializeEntries() {
        if (table.isEmpty()) {
            table.put(UserRole.GUIDE, List.of(
                    Permission.VIEW_FAIR_INFO,
                    Permission.VIEW_TOUR_INFO,
                    Permission.VIEW_TOUR_REVIEW,
                    Permission.RU_FROM_TOUR,
                    Permission.AR_TOUR_ASSIGNMENT,
                    Permission.REPORT_TOUR_TIMES
            ));

            table.put(UserRole.ADVISOR, List.of(
                    Permission.AR_TOUR_REQUESTS,
                    Permission.AR_TOUR_CHANGES,
                    Permission.REQUEST_TOUR_CHANGES,
                    Permission.ASSIGN_OTHER_GUIDE,
                    Permission.MANAGE_GUIDE_EXPERIENCE,
                    Permission.EDIT_TOUR_SS_TIME
            ));

            table.put(UserRole.COORDINATOR, List.of(
                    Permission.AR_GUIDE_APPLICATIONS,
                    Permission.INVITE_GUIDE_TO_FAIR,
                    Permission.FIRE_GUIDE_OR_ADVISOR,
                    Permission.AR_FAIR_INVITATIONS,
                    Permission.MANAGE_TIMESHEET,
                    Permission.VIEW_WORK_DONE_BY_GUIDE,
                    Permission.AR_REVIEWS
            ));

            table.put(UserRole.DIRECTOR, List.of(
                    Permission.TOTAL_ANALYTICS_ACCESS
            ));

            table.put(UserRole.ADMIN, List.of(
                    Permission.ADMINISTRATOR
            ));

        }
    }
}
