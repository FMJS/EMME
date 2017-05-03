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
      var x = new Int8Array(data.x_sab); x[0] = 1;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); id3_R_t2 = x[0]; report.push("id3_R_t2: "+id3_R_t2);
      if(id3_R_t2 <= 0) {
         var x = new Int8Array(data.x_sab); x[0] = 0;
      } else {
         var x = new Int8Array(data.x_sab); x[1] = 0;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
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
      if (reports >= 3) break;
   }
}

report.sort();
report = report.join(";");
var outputs = [];
outputs[0] = "id3_R_t2: 1;id6_R_t3: 0";
outputs[1] = "id3_R_t2: 1;id6_R_t3: 1";
outputs[2] = "id3_R_t2: 0;id6_R_t3: 0";
outputs[3] = "id3_R_t2: 0;id6_R_t3: 1";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtlj0PgjAQhnd/RUdJTEoVHTQOGiUOfiSocSRGHEgEHHAy/ndbKlAp2IIkRu3WvO17vStPjoMwuITn
//SwghcJ2Obdlhuw/QwHV6ZN3pAx1CL3COJ3xgNgZDcG3G51rY0bV3eKW1AFYRXnt71yd6m+iI16mT14vi
//0Cy0GxgtJ2Cx+tT9kU5jZqOkKhsjVdkIad6sSn1ctdbYjMp98iV16cTbjC1kK05btIni+Cb3muyr5Xip
//b70jPrqOXusQ+M7QHM3XU60BRTghhdPX4YS4TcZXFaaM/jhdB2KqY/1Cx0pyQ3Uh9oioutgfIfZiqzpg
//+eqbeOmCDvbOh8x/bqPg8xpsIQledd0vAkaMhnQFmcisapTAS3awqjp1FfUrqblrY21liEKKqC8kqtrg
//JeSp/OglSZnqW79BWXJjjZQZ4t9jRNkda4vc0g==
