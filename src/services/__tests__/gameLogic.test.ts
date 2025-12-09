import { assignRoles } from '../gameLogic';

describe('Role Assignment Logic', () => {

    test('3 Players: Should have 1 Impostor and 2 Citizens', () => {
        const roles = assignRoles(3);
        expect(roles).toHaveLength(3);

        const impostors = roles.filter(r => r === 'impostor');
        const citizens = roles.filter(r => r === 'citizen');
        const spies = roles.filter(r => r === 'spy');
        const helpers = roles.filter(r => r === 'helper');

        expect(impostors).toHaveLength(1);
        expect(citizens).toHaveLength(2);
        expect(spies).toHaveLength(0);
        expect(helpers).toHaveLength(0);
    });

    test('5 Players: Should have 1 Impostor, 1 Spy, 1 Helper', () => {
        const roles = assignRoles(5);
        expect(roles).toHaveLength(5);

        const impostors = roles.filter(r => r === 'impostor');
        const spies = roles.filter(r => r === 'spy');
        const helpers = roles.filter(r => r === 'helper');
        const citizens = roles.filter(r => r === 'citizen');

        expect(impostors).toHaveLength(1);
        expect(spies).toHaveLength(1);
        expect(helpers).toHaveLength(1);
        expect(citizens).toHaveLength(2); // 5 - 3 special = 2
    });

    test('7 Players: Should have 2 Impostors, 1 Spy, 1 Helper', () => {
        const roles = assignRoles(7);
        expect(roles).toHaveLength(7);

        const impostors = roles.filter(r => r === 'impostor');
        const spies = roles.filter(r => r === 'spy');
        const helpers = roles.filter(r => r === 'helper');
        const citizens = roles.filter(r => r === 'citizen');

        expect(impostors).toHaveLength(2);
        expect(spies).toHaveLength(1);
        expect(helpers).toHaveLength(1);
        expect(citizens).toHaveLength(3); // 7 - 4 special = 3
    });

    test('10 Players: Should have 3 Impostors, 1 Spy, 1 Helper', () => {
        const roles = assignRoles(10);
        expect(roles).toHaveLength(10);

        const impostors = roles.filter(r => r === 'impostor');
        const spies = roles.filter(r => r === 'spy');
        const helpers = roles.filter(r => r === 'helper');
        const citizens = roles.filter(r => r === 'citizen');

        expect(impostors).toHaveLength(3);
        expect(spies).toHaveLength(1);
        expect(helpers).toHaveLength(1);
        expect(citizens).toHaveLength(5); // 10 - 5 special = 5
    });

});
