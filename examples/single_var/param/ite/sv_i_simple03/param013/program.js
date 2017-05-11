// Copyright 2017 Cristian Mattarei
//
// Licensed under the modified BSD (3-clause BSD) License.
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


// Thread t1
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[0] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id4_R_t2 = x[0]; report.push("id4_R_t2: "+id4_R_t2);
      var x = new Int8Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      if(id4_R_t2 > id5_R_t2) {
         var x = new Int8Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      } else {
         var x = new Int8Array(data.x_sab); id7_R_t2 = x[0]; report.push("id7_R_t2: "+id7_R_t2);
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

var data = {
   x_sab : new SharedArrayBuffer(8),
}
$262.agent.broadcast(data);
var report = [];

// MAIN Thread

var thread_report;
var reports = 0;
var i = 0;
while (true) {
   thread_report = $262.agent.getReport();
   if (thread_report != null) {
      for(i=0; i < thread_report.length; i++){
         report.push(thread_report[i]);
         print(thread_report[i]);
      }
      reports += 1;
      if (reports >= 2) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 2";
outputs[4] = "id4_R_t2: 0;id5_R_t2: 2;id7_R_t2: 2";
outputs[5] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 2";
outputs[6] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 0";
outputs[7] = "id4_R_t2: 2;id5_R_t2: 0;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtm81vgjAYxu/7KzhqYoL2FUy2eNBsZod9JLrFI1nGDiRTd8DTsv99fDkrK4nQFrruuTUv8kBLf3na
//R3Dd3T7+2Meu60ThOFgGMbt0hldR6HHtyaHtuptd+Pae/Ph27kydz14UsmAdxKNBcjZlrf7A6R2U0mqu
//U65OuKonrI4Stc1LtE3rjFPm61RRH1foeBX14rpfzuzh2rl/tK9nWf3Yn7Gw6gmrvAIJFUioQGWFfHSX
//80U2vCdjdrjj5MxhevbJ0AkOTsQHiyssiucn1K+SFqvmiqt1qpi3s/F93W3D6WJ2t7rpX7gACAB1DdBP
//b7Xgw49ly/AwwAN4unQfViZLlffwY68QHgZ4AE+L8LBq55FGhwl9RxM4cB2AY8iSTRoc6goc7HUATqfL
//NdK1XCPAA3isdh3S4zotg8MADsAxKqLmVnPKAupCE/AAHpvj6XPQqRdOKwSHARyAY2g0LeM54phAEhwG
//cACO8bH0OdjUCaXhNoDG+ki6+SJNOzTY2wAaU+NomSUaARyA8z+j6OZu0yo0+P8G0JgVQ5OGGJoAD+Cx
//P4Ym5TE06QkGAA7AMSmGJuUxNOmJoQEOwDEnhibFMTTcBtBYH0OT4hgaextA8w9iaFIeQwMcgGN9DE2K
//Y2iF+5oUGl8RNLqny/GqvnDq+hUavjQ0untWZ8LXmdqSI1a6C194PV9mXyMwIl/Jd5+nLuTX+5TgafkM
//dsCO4ez8Mhw15PDPQj83DNyAG4M8p/lLnVWOc8Y7A+AG3Pxpv2lOjdht9DCDNRqYMclrSLnXELgBN5Z7
//DSn2mnOZ+QZ4fncV
