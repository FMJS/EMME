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
      var x = new Int8Array(data.x_sab); x[0] = 2;
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
      if(id4_R_t2 < id5_R_t2) {
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
outputs[1] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 0";
outputs[2] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 0";
outputs[3] = "id4_R_t2: 0;id5_R_t2: 0;id7_R_t2: 2";
outputs[4] = "id4_R_t2: 2;id5_R_t2: 0;id7_R_t2: 2";
outputs[5] = "id4_R_t2: 2;id5_R_t2: 2;id7_R_t2: 2";
outputs[6] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 0";
outputs[7] = "id4_R_t2: 0;id5_R_t2: 2;id6_R_t2: 2";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrtnEtrwkAUhff9FbNUEFLnmhFaXCitdNEHaIvLUJouAlW7iKvS/968rKNOII8ZjZOzG+6YM8nNfBw8
//ODrOehN+b0LHYYE/8GZeyG/Y9W3gu9J4uB07znLtf35FH36YsBH76QQ+9xZe2O9FV1My6vZYZ6sUV1Od
//w+pQqrrKaj9SW74Hq7jOJWW5Tjn1QY6Om1PP1v1l4+c79vRi35Ml9d3zDJRVV1mVFUipQEoFOlRIuzub
//TJP27vVse8fRldfx1XutU0wO1ZPZCtPs/Sn186TVqqnifBErpuOkvx/rlT+ajh/n990rRwUQB0AA6IQA
///XfBCD5yjwEP4LEMHjIKD50PHg54AM/5nOdoSo/vyFWAA3Dsc53a4BDAATgtdBwy4zgEcACO1Y5DZhzH
//EDh58TQHOACnUfG05FXawulMU3e6BngAT5Oi6SLolAumAQ7AaUEsXQQcOhc4HOAAnEZG0tX9Rp2rARpA
//Y30cXd1rAA2gaWkUXd1pCNAAmnbG0NWdxgg0iKABzWVE0GQggiYkaYDH/giatEfQAAfgtCCCJu0RNOE7
//DsCxPYImzRE0oAE01kfQpDmCBjSAxvoImjRH0IAG0FgfQZPmCJr0RdAxNELT8QHT22W3qlBuXZGjIWpD
//Y/rJymz4Mlu7ZscO7kIo1xP1IugjGxKa/qJDfk+i3BGC19kb2AE7jWeHTLFDJ2WHgx2w0yDfqXP2Ru06
//BX4zAG7AzYV7Th1uCNyAm5b6DWn3GwI34MZ6vyHtflOUmz/snXdL
