'use strict';

var co = require('co');
var util = require('util');
var logger = require('winston');
var api = require('../api');
var manifest = require('../manifest');
var message = require('../../../message');

var app = require.main.exports;
var bot = app.bot;
var config = app.config;

function exec(cmd) {

    return co(function *() {

        var msg = cmd.msg; 
        var input = cmd.args[0];
        //var activity = input.replace(/\s+/g, "");
        var busyMsg;

        // Retrieve latest Advisor Data
        var advisor = yield api.advisor();

        /**
         * Base Response property
         * - data
         * - definitions
         */
        var res = [advisor].Response;

        /**
         * == Response.data ==
         *
         * Contains : 
         * - activities, 
         * - activityCategories
         */
        var resData = [res].data;

        /**
         * === Response.data.activities ===
         * 
         * Returns a list of all known the activities
         * - prisonofelders
         * - elderchallenge
         * - trials
         * - armsday
         * - weeklycrucible
         * - kingsfall
         * - vaultofglass
         * - crota
         * - nightfall
         * - heroicstrike
         * - dailychapter
         * - dailycrucible
         * - prisonofelders-playlist
         * - ironbanner
         * - xur
         * - srl
         * 
         * Extending this to include one of the above activities
         * will result in the following properties being exposed:
         * - identifier
         * - status
         * - display
         * - vendorHash
         * - bountyHashes
         * - extended
         */
        var activities = [resData].activities;

        /**
         * === Response.data.activityCategories ===
         * 
         * This exposes a list of known category hashes. These do 
         * not appear anywhere else in the object and would need to 
         * referenced from the "DestinyActivityCategoryDefinition" 
         * collection of the database.
         * 
         * An example query to do this would look like:
         * db.getCollection(
         *      'destiny.manifest.en.DestinyActivityCategoryDefinition'
         * ).find({ hash: hash});
         */
        var activityCategories = [resData].activityCategories;

        /**
         * == Response.definitions ==
         * 
         * This is only returned and part of the response body if the
         * query string, ?definitions=true, is passed when making the 
         * API call to the advisor URI. 
         * 
         * It contains a large list of hash look-ups, that you would 
         * otherwise have to make a database call to cross-reference.
         * 
         * - items
         * - buckets
         * - stats
         * - perks
         * - talentGrids
         * - statGroups
         * - progressionMappings
         * - itemCategories
         * - sources
         * - objectives
         * - progressions
         * - damageTypes
         * - materialRequirements
         * - unlockValues
         * - vendorDetails
         * - locations
         * - factions
         * - events
         * - vendorCategories
         * - vendorSummaries
         * - destinations
         * - activities
         * - books
         * - places
         * - activityTypes
         * - activityBundles
         * - enemyRaces
         * - flags
         */
        var definitions = [res].definitions;

        /**
         * === Response.definitions.destinitions ===
         * 
         * Contains a list of destination hash objects
         * that contain destination info. This is used to
         * replace the destination hash found inside the 
         * `activities.display.destinationHash` property.
         * 
         * 518553403
         * 2512542997
         * 2777041980
         * 2897855902
         * 3393213630
         * 3393905939
         * 4072959335
         * 4233735899
         */
        var destinations = [definitions].destinations;

        //console.log("Activity found was " + activities[input].display.advisorTypeCategory);
        busyMsg = yield bot.sendMessage(msg, "Pulling latest Destiny Daily and Weekly Advisors** :mag:");
        
    })

}

module.exports = {
    desc: 'Get list of daily and weekly advisors',
    name: 'advisor',
    alias: ['ad'],
    exec: exec
}