import { StyleSheet, Dimensions } from 'react-native';
import RF from "react-native-responsive-fontsize";
import { WIN_WIDTH, WIN_HEIGHT } from './Helpers';

export const headerIconSize = 30;

export const GeneralStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        margin: 15
    },
    bottomButton: {
        flex: 1,
        position: 'absolute',
        justifyContent: 'center',
        bottom: 0,
    },
    roundButtonsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    hyperlink: {
        textDecorationLine: 'underline',
    },
    iconStyle: {
        fontSize: headerIconSize,
        color: '#f7f6f4',
    },
    iconStyle2: {
        fontSize: headerIconSize,
        color: '#6200EE',
    },
    sectionHeader: {
        fontWeight: 'bold',
    },
    sectionView: {
        flex: 1,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#6200EE',
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#f7f6f4',
        marginTop: 0,
        marginBottom: 4,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        paddingVertical: 4,
        color: '#6200EE',
    },
    noItemDisplay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyBox: {
        height: 90,
    },
});

export const AuthLoadingScreenStyle = StyleSheet.create({
    activityIndicatorContainer: {
        flex: 1,
        flexDirection: 'column',
        margin: 15,
        justifyContent: 'center',
        alignItems: 'center',
    }
});



export const HomeScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    filtersMainContainer: {
        flex: 1,
        flexDirection: 'column',
        marginHorizontal: 15,
        marginVertical: 5,
        borderRadius: 10,
        borderWidth: 1,
        backgroundColor: '#f7f6f4',
        paddingHorizontal: 5,
    },
    sectionListContainer: {
        flex: 1,
        marginHorizontal: 0,
        marginTop: 10,
        marginBottom: 3,
    },
    showFilterTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    showFilterTitle: {
        fontWeight: 'bold',
    },
    filtersContainer: {
        // flex: 1,
        flexDirection: 'column',
        borderWidth: 2,
        borderRadius: 10,
        padding: 5,
        borderColor: '#9861e8',
        backgroundColor: '#a17ed3'
        // justifyContent: 'space-evenly',
        // alignItems: 'flex-start',
    },
    filter: {
        // flex: 1,
        flexDirection: 'column',
        // justifyContent: 'space-evenly',
        // alignItems: 'flex-start',
    },
    filterTitle: {
        fontWeight: 'bold',
        color: 'white',
    },
    filterPickerStyle: {
        color: 'white',
    },
    prezzoDareStyle: {
        color: 'red',
        fontSize: RF(3),
    },
    prezzoAvereStyle: {
        color: 'green',
        fontSize: RF(3),
    },
    transactionName: {
        fontWeight: 'bold',
        flexWrap: 'wrap'
    },
    transactionDareContainer: {
        borderColor: 'red',
    },
    transactionAvereContainer: {
        borderColor: 'green',
    },
});

export const TransactionScreenStyle = StyleSheet.create({
    mainContainer: {
        flex: 1,
        flexDirection: 'column',
        margin: 15,
    },
    fieldContainer: {
        flex: 1,
        flexDirection: 'column',
        marginVertical: 5,
    },
    fieldName: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: RF(3.5),
        flexWrap: 'wrap',
    },
    fieldValue: {
        fontSize: RF(2.5),
        flexWrap: 'wrap',
    }
});

export const ListItemStyle = StyleSheet.create({
    container: {
        borderRadius: 10,
        borderWidth: 1,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        marginVertical: 5,
        marginHorizontal: 5,
    },
    leftSide: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        // borderColor: 'red',
        // borderWidth: 1,
    },
    rightSide: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        // borderColor: 'green',
        // borderWidth: 1,
    },
    chevron: {
        // flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export const LoginScreenStyle = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        margin: 25,
    },
    welcome: {
        fontSize: 25,
        textAlign: 'center',
        color: '#6200EE',
        fontWeight: 'bold',
    },
    input: {
        fontSize: 20,
        borderBottomColor: '#47315a',
        borderBottomWidth: 1,
        paddingBottom: 1,
    },
    invalidData: {
        textAlign: 'center',
        color: '#CC0000',
    },
    hyperlinkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    centeredText: {
        textAlign: 'center',
    },
});


export const CustomHeaderStyle = StyleSheet.create({
    headerContainer: {
        marginHorizontal: 10,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    headerTitle: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: RF(2.5),
        marginLeft: 0,
        color: '#f7f6f4',
    },
    menuIconContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        marginLeft: 10,
    },
    searchbarContainer: {
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    },
    searchbar: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 15,  //questi padding sono per tenere il testo centrato nella searchbar 
        paddingBottom: 0,
        paddingTop: 0,
        height: headerIconSize,
        // includeFontPadding: false,
        // textAlignVertical: "center",
        borderColor: 'gray',
        borderWidth: 1,
        backgroundColor: '#f7f6f4',
    },
    rightIconsContainer: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginRight: 10,
    },
});


export const WalkthroughScreenStyle = StyleSheet.create({
    mainContent: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#dee5ef',
    },
    text: {
        flex: 1,
        flexWrap: 'wrap',
        color: 'black',
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    title: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 22,
        color: 'black',
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    imageContainer: {
        flex: 2,
        // borderWidth: 1,
        // borderColor: 'red',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: WIN_WIDTH * 0.9,
    },
    imageStyle: {
        maxWidth: WIN_WIDTH * 0.9,
        // maxHeight: WIN_HEIGHT,
        // borderWidth: 1,
        // borderColor: 'black',
    },
    nextButtonIcon: {
        backgroundColor: 'transparent',
    },
    doneButtonIcon: {
        backgroundColor: 'transparent',
    }
});