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
      var x = new Int16Array(data.x_sab); id2_R_t1 = x[0]; report.push("id2_R_t1: "+id2_R_t1);
      var x = new Int8Array(data.x_sab); x[0] = 2;
      var x = new Int8Array(data.x_sab); x[1] = 2;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int16Array(data.x_sab); id5_R_t2 = x[0]; report.push("id5_R_t2: "+id5_R_t2);
      var x = new Int8Array(data.x_sab); x[0] = 1;
      var x = new Int8Array(data.x_sab); x[1] = 1;
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
outputs[0] = "id2_R_t1: 0;id5_R_t2: 0";
outputs[1] = "id2_R_t1: 1;id5_R_t2: 0";
outputs[2] = "id2_R_t1: 256;id5_R_t2: 0";
outputs[3] = "id2_R_t1: 257;id5_R_t2: 0";
outputs[4] = "id2_R_t1: 0;id5_R_t2: 2";
outputs[5] = "id2_R_t1: 1;id5_R_t2: 2";
outputs[6] = "id2_R_t1: 256;id5_R_t2: 2";
outputs[7] = "id2_R_t1: 257;id5_R_t2: 2";
outputs[8] = "id2_R_t1: 0;id5_R_t2: 512";
outputs[9] = "id2_R_t1: 1;id5_R_t2: 512";
outputs[10] = "id2_R_t1: 256;id5_R_t2: 512";
outputs[11] = "id2_R_t1: 257;id5_R_t2: 512";
outputs[12] = "id2_R_t1: 0;id5_R_t2: 514";
outputs[13] = "id2_R_t1: 1;id5_R_t2: 514";
outputs[14] = "id2_R_t1: 256;id5_R_t2: 514";
outputs[15] = "id2_R_t1: 257;id5_R_t2: 514";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtmk9rgzAYxu/7FDluIMTYaGBjh5VRdtkG3aFHGbQHYV13sKfR7z6d/2KMVGOil+cWnuR9jYnvT/IQ
//Sk/n9OecUkqSfRBv45TdE/8h2Yd5O8jalB5P+8NXNuBlTR7J7201zssiVvEua915pKVySS1GqGqRPVej
//XA1UVUhqMUJVWdY+fibfXj3vri7PTtZ5j148v6tHPc8t53MhT2/P5PUdq6NbHeXt5SyNGmnHyhmalZIz
//NGqkHStn4NoMXJuBqxmKPd6uN/+b3Jpl9c5ZpJ9H93WysrPZR02ktpNVj990PjFplD66iPzY5ZGXG6or
//d4ZyR7mj3MeXO+uUe53Ud1/s+uU0Q0AQRoAAIAAI2Pjn1xNgc0JAWICAAAQAAUBgIAQ6P/u5EHB90cwA
//IJ/7A5Q/yh/l7/rc3+2st8efcOpX9DLnSC8ACAACgADHXoANAAx2Aoyx0PYHAAaAAWBw7A/YBYNwBgYB
//MAAMAMNcnoEZFowcA2MoyD5CyAAFQAFQWOAGQb0NzJ6TwI2cBEAAEAAEFrhXMB4Bpl4CN/QSgAagAWhY
//4LbBFDQIZ2gQQAPQADQseQdhCBhs+Anc0E/ggAKgACg48RMkL9Gmm7DSfkqmXgIAAAAAAC68BKvlf81J
//mAoF1UcAFoAFYMGFj+AIC8IRFgSwACwAC449hIlQGOMgDEfCHxZX+t0=
