const base_url = "https://api.football-data.org/v2/";
var logoNotFound = "../assets/img/logo-not-found.png"

function dateTimeSlicer(dt) {
    var date = dt.split("T")[0];
    var time = dt.split("T")[1].slice(0,5);
    return [date,time];
}

const fetchAPI = function(url) {
    return fetch(url,{
        headers:{
            'X-Auth-Token':'f25b0ba292da4093942cd543bb9229a7'
        },
    })
    .then(function(response){
        if (response.status !== 200) {
            console.log("Error : " + response.status);
            // Method reject() akan membuat blok catch terpanggil
            return Promise.reject(new Error(response.statusText));
        } else {
            // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
            return Promise.resolve(response);
        }
    })
    .then(function(response){
        return response.json()
    })
    .catch(function(err){
        console.log(err)
    });
}

const getTeamsAPI = function(league_id) {
    var teamResourceURL = base_url + "competitions/"+league_id+"/teams/";
    return new Promise(function(resolve,reject){
        fetchAPI(teamResourceURL)
        .then(function(data){
            resolve(data);
        }).catch(function(err){
            reject(err);
        })
    })
}

const getTeamLogoFromDb = function(teamId) {
    return new Promise(function(resolve,reject){
        dbGetTeam(teamId)
        .then(function(data){
            resolve(data.teamLogo);
        }).catch(function(err){
            reject(err);
        })
    })
}

// Blok Premiere League in Number
const getCurrentMatchdayNTotalTeamsAPI = function(league_id) {
    return new Promise(function(resolve,reject){
        getTeamsAPI(league_id)
        .then(function(data){
            var cmntt = [data.season.currentMatchday,data.count];
            resolve(cmntt);
        }).catch(function(err){
            reject(err);
        });
    });
}
const getTotalGoalsNTotalPointsAPI = function(league_id) {
    var url = base_url + "competitions/"+league_id+"/standings?standingType=TOTAL";
    return new Promise(function(resolve,reject){
        fetchAPI(url)
        .then(function(data){
            var tg = 0;
            var tp = 0;
            data.standings[0].table.forEach(function(dtable) {
                tg += dtable.goalsFor;
                tp += dtable.points;
            });
            var tgntp = [tg,tp];
            resolve(tgntp);
        }).catch(function(err) {
            reject(err);
        });
    });
}
function getAllInNumber(league_id){
    return Promise.all([
        getCurrentMatchdayNTotalTeamsAPI(league_id),
        getTotalGoalsNTotalPointsAPI(league_id),
    ]);
}
function inNumberStructure(data,league_id) {
    var inNumberHTML = `
        <div class="col s3">
            <p class="fw-bold fs-34 margin-0">${data[0][0]}</p>
            <p class="margin-0">Current Matchday</p>
        </div>
        <div class="col s3">
            <p class="fw-bold fs-34 margin-0">${data[0][1]}</p>
            <p class="margin-0">Total Teams</p>
        </div>
        <div class="col s3">
            <p class="fw-bold fs-34 margin-0">${data[1][0]}</p>
            <p class="margin-0">Total Goals</p>
        </div>
        <div class="col s3">
            <p class="fw-bold fs-34 margin-0">${data[1][1]}</p>
            <p class="margin-0">Total Points</p>
        </div>
    `;
    switch (league_id){
        case '2021':
            $('#eplinnum').html(inNumberHTML);
            break;
        case '2014':
            $('#laligainnum').html(inNumberHTML);
            break;
        case '2003':
            $('#eredivisieinnum').html(inNumberHTML);
            break;
        case '2002':
            $('#bundesligainnum').html(inNumberHTML);
            break;
    }
}
function inNumber(league_id){
    getAllInNumber(league_id)
    .then(function(data){
        console.log(data);
        inNumberStructure(data,league_id);
    }).catch(function(err){
        console.log(err);
    })
}

// Blok Matches
function matchesStructure(data,league_id) {
    var matchesHTML = "";
    var matches = data.matches; 
    matches.forEach(function(match,i){
        if(i%2==0){
            var dt1 = dateTimeSlicer(match.utcDate);
            if(matches[i+1]!==undefined) {
                var dt2 = dateTimeSlicer(matches[i+1].utcDate);
                matchesHTML += `
                    <div class="row white mb-0 border-bottom-4">
                        <div class="col s6 border-right-2 pl-35 pr-35 pt-10 pb-10" id="${league_id}${i}">
                            <div class="row mt-10 mb-5">
                                <div class="col s8">
                                    <div class="row valign-wrapper mb-10">
                                        <div class="col s2">
                                            <img class="team-logo-matches" id="${match.homeTeam.id}">
                                        </div>
                                        <div class="col s10">
                                            <p class="margin-0">${match.homeTeam.name}</p>
                                        </div>
                                    </div>
                                    <div class="row valign-wrapper mb-0">
                                        <div class="col s2">
                                            <img class="team-logo-matches" id="${match.awayTeam.id}">
                                        </div>
                                        <div class="col s10">
                                            <p class="margin-0">${match.awayTeam.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col s4 center-align border-left-1">
                                    <p class="mb-10 mt-20">${dt1[0]}</p>
                                    <p class="mt-0">${dt1[1]}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col s6 border-right-2 pl-35 pr-35 pt-10 pb-10" id="${league_id}${i+1}">
                            <div class="row mt-10 mb-5">
                                <div class="col s8">
                                    <div class="row valign-wrapper mb-10">
                                        <div class="col s2">
                                            <img class="team-logo-matches" id="${matches[i+1].homeTeam.id}">
                                        </div>
                                        <div class="col s10">
                                            <p class="margin-0">${matches[i+1].homeTeam.name}</p>
                                        </div>
                                    </div>
                                    <div class="row valign-wrapper mb-0">
                                        <div class="col s2">
                                            <img class="team-logo-matches" id="${matches[i+1].awayTeam.id}">
                                        </div>
                                        <div class="col s10">
                                            <p class="margin-0">${matches[i+1].awayTeam.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col s4 center-align border-left-1">
                                    <p class="mb-10 mt-20">${dt2[0]}</p>
                                    <p class="mt-0">${dt2[1]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }else{
                matchesHTML += `
                    <div class="row white mb-0 border-bottom-4">
                        <div class="col s6 border-right-2 pl-35 pr-35 pt-10 pb-10" id="${league_id}${i}">
                            <div class="row mt-10 mb-5">
                                <div class="col s8">
                                    <div class="row valign-wrapper mb-10">
                                        <div class="col s2">
                                            <img class="team-logo-matches" id="${match.homeTeam.id}">
                                        </div>
                                        <div class="col s10">
                                            <p class="margin-0">${match.homeTeam.name}</p>
                                        </div>
                                    </div>
                                    <div class="row valign-wrapper mb-0">
                                        <div class="col s2">
                                            <img class="team-logo-matches" id="${match.awayTeam.id}">
                                        </div>
                                        <div class="col s10">
                                            <p class="margin-0">${match.awayTeam.name}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col s4 center-align border-left-1">
                                    <p class="mb-10 mt-20">${dt1[0]}</p>
                                    <p class="mt-0">${dt1[1]}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }
        }
    });
    
    switch (league_id){
        case '2021':
            $('#epl').html(matchesHTML);
            break;
        case '2014':
            $('#laliga').html(matchesHTML);
            break;
        case '2003':
            $('#eredivisie').html(matchesHTML);
            break;
        case '2002':
            $('#bundesliga').html(matchesHTML);
            break;
    }
    
    matches.forEach(function(match,i){
        var teamIds = [match.homeTeam.id,match.awayTeam.id];
        teamIds.forEach(function(id){
            getTeamLogoFromDb(id).then(function(logoURL){
                if(logoURL==null) $('#'+league_id+i+'>div>div>div>div>#'+id).attr('src',''+logoNotFound);
                else {
                    logoURL = logoURL.replace(/^http:\/\//i, 'https://');
                    $('#'+league_id+i+'>div>div>div>div>#'+id).attr({
                        src     : ""+logoURL,
                        onError : "this.onerror=null;this.src='"+logoNotFound+"';",
                    });
                }
            }).catch(function(err){
                console.log(err);
                $('#'+id).attr('src',''+logoNotFound);
            });
        })
    })
}
function getMatches(league_id) {
    var url = base_url + "competitions/"+league_id+"/matches?status=SCHEDULED";
    if ('caches' in window) {
        caches.match(url).then(function(response) {
            if (response) {
                response.json().then(function (data) {
                    matchesStructure(data,league_id);
                })
            }
        })
    }

    fetchAPI(url)
    .then(function(data){
        matchesStructure(data,league_id);
    })
    .catch(function(err){
        console.log(err);
    })
}

// Blok Standings
function standingStructure(data,league_id) {
    var standingHTML = "";
    data.standings[0].table.forEach(function(standing){
        var logoURL = standing.team.crestUrl
        if(logoURL===null) logoURL = logoNotFound;
        else logoURL = logoURL.replace(/^http:\/\//i, 'https://');
        standingHTML += `
            <tr data-id="${standing.team.id}">
                <td class="team-standing pl-30">
                    <div class="row mb-0 valign-wrapper">
                        <div class="col s2"><p class="margin-0"></p>${standing.position}</div>
                        <div class="col s1">
                            <img class="team-logo-standings" src="${logoURL}" 
                                onError="this.onerror=null;this.src='${logoNotFound}';"
                            >
                        </div>
                        <div class="col s9"><p class="margin-0">${standing.team.name}</p></div>
                    </div>
                </td>
                <td>${standing.playedGames}</td>
                <td>${standing.won}</td>
                <td>${standing.draw}</td>
                <td>${standing.lost}</td>
                <td>${standing.goalsFor}</td>
                <td>${standing.goalsAgainst}</td>
                <td>${standing.goalDifference}</td>
                <td>${standing.points}</td>
            </tr>
        `;
    });
    
    switch (league_id){
        case '2021':
            $('#epl>table>tbody').html(standingHTML);
            break;
        case '2014':
            $('#laliga>table>tbody').html(standingHTML);
            break;
        case '2003':
            $('#eredivisie>table>tbody').html(standingHTML);
            break;
        case '2002':
            $('#bundesliga>table>tbody').html(standingHTML);
            break;
    }
}
function getStanding(league_id) {
    var url = base_url + "competitions/"+league_id+"/standings?standingType=TOTAL";
    if ('caches' in window) {
        caches.match(url).then(function(response) {
        if (response) {
            response.json().then(function (data) {
                standingStructure(data,league_id);
            })
        }
        })
    }

    fetchAPI(url)
    .then(function(data){
        standingStructure(data,league_id);
    })
    .catch(function(err){
        console.log(err);
    })
}
