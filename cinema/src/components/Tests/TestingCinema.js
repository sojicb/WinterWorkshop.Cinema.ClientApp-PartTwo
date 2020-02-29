import React from 'react';
import { shallow } from 'enzyme';
import ShowAllCinemas from '../admin/CinemaActions/ShowAllCinemas';
import EditCinema from '../admin/CinemaActions/EditCinema';



describe('ShowAllCinemas', () =>{

    const showAllCinemas = shallow(<ShowAllCinemas/>);
    
    it('renders properly', () => {
        expect(showAllCinemas).toMatchSnapshot();
    });

    it('initializes all cinemas in `state` ', () => {
        expect(showAllCinemas.state()).toEqual({ cinemas: [] })
    });

    it('initializes the `state` with an empty list of cinemas', () =>{
        expect(showAllCinemas.state().cinemas).toEqual([]);    
    });

    it('Deletes cinema to `state` when clicking `removeCinema` button', () => {
        showAllCinemas.find('.text-center cursor-pointer').simulate('click');

        expect(showAllCinemas.state().cinemas).toEqual([{id: -1}]);
    })

    describe('When typing into cinemas input', () => {
        beforeEach( () => {
            showAllCinemas.find('.text-center cursor-pointer').simulate('change', {taget: {value: 'Klepicev Film'}})
        });

        it('updates the movie in `state`', () =>{
            expect(gift.state().cinemas).toEqual('Cinestar');
        });
    });
});


describe('EditCinema', () =>{

    const editCinema = shallow(<EditCinema/>);
    
    it('renders properly', () => {
        expect(editCinema).toMatchSnapshot();
    });

    it('initializes all name in `state` ', () => {
        expect(editCinema.state()).toEqual({ name: [] })
    });

    it('initializes the `state` with an empty list of name', () =>{
        expect(editCinema.state().name).toEqual([]);    
    });

    it('Edits cinema to `state` when clicking `removeCinema` button', () => {
        editCinema.find('.editCinema').simulate('click');

        expect(editCinema.state().name).toEqual([{id: 1}]);
    })

    describe('When typing into name input', () => {
        beforeEach( () => {
            editCinema.find('.editCinema').simulate('change', {taget: {value: 'Cinestar'}});
        });

        it('updates the movie in `state`', () =>{
            expect(gift.state().name).toEqual('Cinestar');
        });
    });

    it('Edits a Cinema component', () => {
        expect(editCinema.find('Cinestar').exists()).toEqual(true);
    });
});