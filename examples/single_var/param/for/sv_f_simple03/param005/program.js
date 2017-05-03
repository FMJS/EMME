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
      for(i = 0; i <= 2; i++){
         var x = new Int8Array(data.x_sab); x[i+1] = i+1;
      }
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      for(i = 0; i <= 1; i++){
         var x = new Int16Array(data.x_sab); id4_R_t2 = x[i]; report.push("id4_R_t2_"+i+": "+id4_R_t2);
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
outputs[0] = "id4_R_t2_0: 0;id4_R_t2_1: 0";
outputs[1] = "id4_R_t2_0: 1;id4_R_t2_1: 0";
outputs[2] = "id4_R_t2_0: 256;id4_R_t2_1: 0";
outputs[3] = "id4_R_t2_0: 257;id4_R_t2_1: 0";
outputs[4] = "id4_R_t2_0: 0;id4_R_t2_1: 2";
outputs[5] = "id4_R_t2_0: 1;id4_R_t2_1: 2";
outputs[6] = "id4_R_t2_0: 256;id4_R_t2_1: 2";
outputs[7] = "id4_R_t2_0: 257;id4_R_t2_1: 2";
outputs[8] = "id4_R_t2_0: 0;id4_R_t2_1: 768";
outputs[9] = "id4_R_t2_0: 1;id4_R_t2_1: 768";
outputs[10] = "id4_R_t2_0: 256;id4_R_t2_1: 768";
outputs[11] = "id4_R_t2_0: 257;id4_R_t2_1: 768";
outputs[12] = "id4_R_t2_0: 0;id4_R_t2_1: 770";
outputs[13] = "id4_R_t2_0: 1;id4_R_t2_1: 770";
outputs[14] = "id4_R_t2_0: 256;id4_R_t2_1: 770";
outputs[15] = "id4_R_t2_0: 257;id4_R_t2_1: 770";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9PwjAYBvC7n6JHSUi6vlNmNB4khnhREzxwXEzGYYmIh3EyfHfHn+G6tgTaDqV7brCXt2zt8sv2
//pJzPF8XXouCc5dlVOk4LSqNbFt3tvonyG+ezeTb9KH/0NGT37PsyzyidpIXol13x+lMa9fpMd1wYjtPm
//eNWtdmgqco9mtOoK+r9Xsx1NlL+bveefq8rmXNTj8pVoKuYeUivVuRgrordkDy+P7PkVc+pvThszI3co
//xzXzIndoKkKdMW2P+X/I2EOa+2M8HK1vkMZaVFdf9q/HMJeFXBaNMu0vx9VpjLa3qeFfTCNsut8mq+7l
//BdeDIwAOwAE45wKO0ICzW5DoxNxEzdvBniG6HgAiQASIzvnJpzbx4i8okhfeBaMEGAEjYPSvMTI99pyQ
//Is2zj1eI5DSIwBAYAkOhpkGxplxbHHJMg5TKbmyLnAgUgSJQFGhO5B2iw3IiR6CaCRKIAlEgKtgEqR2k
//Dnhxc2YqAVNgCkx1IVtyQcohW3IkSk6dksENiAJRIKpLu5BqSxC3lDuRTe4EjIARMOrUDiUnitySJ7JL
//noAUkAJSHdu95M6Uw4sd2WVPgApQAapO7Ww6lKkW0ieySp8SbL4EUSAqrPRJysDbSJ/k5fWWPgEjYASM
//gkqf2qRob/rkiyglfQJSQApIBZY+tc6U+cXOH1QJoAJUgCrg9MkTU8enT8ci9QMbyWo6
