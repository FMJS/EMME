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
      var x = new Int8Array(data.x_sab); x[0] = 3;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      var x = new Int8Array(data.x_sab); x[3] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id6_R_t2 = x[0]; report.push("id6_R_t2: "+id6_R_t2);
      var x = new Int16Array(data.x_sab); id7_R_t2 = x[1]; report.push("id7_R_t2: "+id7_R_t2);
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
outputs[0] = "id6_R_t2: 0;id7_R_t2: 0";
outputs[1] = "id6_R_t2: 3;id7_R_t2: 0";
outputs[2] = "id6_R_t2: 512;id7_R_t2: 0";
outputs[3] = "id6_R_t2: 515;id7_R_t2: 0";
outputs[4] = "id6_R_t2: 0;id7_R_t2: 512";
outputs[5] = "id6_R_t2: 3;id7_R_t2: 512";
outputs[6] = "id6_R_t2: 512;id7_R_t2: 512";
outputs[7] = "id6_R_t2: 515;id7_R_t2: 512";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt2k9LwzAYBvC7nyJHhUHWvMkGigeHDC8qzMOORaiHgnMeupPsu9uuXenat9ql6ZbBcytv3vRPWn6U
//h0i53iTfm0RKEUeTcBEm6laM7+Jouj+WcrWOPj7ThqeZuBc/13GkwmWYBKN0Bu2ObkbioKrZqqlUie0l
//tlez1fxes2p+p3k1SDtW7/FXVleV7mqdWuq6pW5a6pOW6xb3sxUPL4/i+RVr1n3Nak8/YavVXmJ7ie3V
//bK9mew3ba+q9+TtezOa7l3ywwvunS2eOs9ltg0ExOOUG1V+DtL/8vPjE2PPzs/OZb8ts5vZKcggQEAAC
//QMAVAkEDgXKZx8MTwFzVGgYTKNAAGkDDcP8H5XIGp6SBHNBgQANoAA29aGj8GJwKBsW+8P4sIE8ACkDB
//gzyBGoPlgqseaUKtXpwTGQNgAAyXkDG4YKFzwmCNBXIHcAEuPMgd3HJBg3GBLAJcgIszZxF2WFglEdZU
//VPOJ9C8DVIAKUOHLjodyYcldQmGsEgrQABpAgzf7II6HwTajMJYZBcAAGADDm90RfcCgwcAwAANgAAz/
//9kx04cJFTmGQU4AKUHEBOUUluXSZUmiWC2QUYAEs+J9ROEXhv4SiLxXIJ4AFsDhfPjEQFjQQFsgmgAWw
//OE820ZOKY5KJ7lD8AvgwYgg=
