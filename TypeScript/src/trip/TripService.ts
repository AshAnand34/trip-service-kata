import UserNotLoggedInException from "../exception/UserNotLoggedInException";
import User from "../user/User";
import UserSession from "../user/UserSession";
import Trip from "./Trip";
import TripDAO from "./TripDAO";

export default class TripService {
    public getTripsByUser(user: User): Trip[] {
        const loggedUser: User = this.getLoggedInUser();

        if (!loggedUser) {
            throw new UserNotLoggedInException();
        }

        const friends: User[] = user.getFriends();

        if (friends.includes(loggedUser)) {
            return this.tripsBy(user);
        }
        return [];
    }

    protected getLoggedInUser(): User {
        return UserSession.getLoggedUser();
    }

    protected tripsBy(user: User) {
        return TripDAO.findTripsByUser(user);
    }
}
