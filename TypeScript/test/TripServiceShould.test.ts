import "jest";

import TripService from '../src/trip/TripService';
import UserNotLoggedInException from "../src/exception/UserNotLoggedInException";
import UserSession from "../src/user/UserSession";
import User from "../src/user/User";
import TripDAO from "../src/trip/TripDAO";

jest.mock("../src/user/UserSession")
jest.mock("../src/trip/TripDAO")

describe("TripServiceShould", () => {
    let registeredUser: User;
    let anotherUser: User;

    beforeEach(() => {
        registeredUser = new User();
        anotherUser = new User();
        
        (UserSession.getLoggedUser as jest.Mock).mockReturnValue(registeredUser);
    })

    it("should error out when a user is not currently logged in", () => {
        (UserSession.getLoggedUser as jest.Mock).mockReturnValue(null)

        var ts: TripService = new TripService();

        expect(() => ts.getTripsByUser(anotherUser)).toThrow(UserNotLoggedInException);
    });

    it("should return empty list when users are not friends", () => {
        var ts: TripService = new TripService();

        anotherUser.addFriend(new User());
        (TripDAO.findTripsByUser as jest.Mock).mockReturnValue(["Paris"]);

        const trips = ts.getTripsByUser(anotherUser);

        expect(trips).toEqual([]);
    });

    it("should return trips when users are friends", () => {
        var ts: TripService = new TripService();

        anotherUser.addFriend(registeredUser);
        (TripDAO.findTripsByUser as jest.Mock).mockReturnValue(["Rome", "Berlin"]);

        const trips = ts.getTripsByUser(anotherUser);

        expect(trips).toEqual(["Rome", "Berlin"]);
    });
});
