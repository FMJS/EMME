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
      var x = new Int8Array(data.x_sab); x[0] = 0;
      var x = new Int8Array(data.x_sab); x[1] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t2
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int8Array(data.x_sab); x[1] = 0;
      var x = new Int8Array(data.x_sab); x[2] = 0;
      $262.agent.report(report);
      $262.agent.leaving();
   })
   `);

// Thread t3
$262.agent.start(
   `$262.agent.receiveBroadcast(function (data) {
      var report = [];
      var x = new Int32Array(data.x_sab); id6_R_t3 = x[0]; report.push("id6_R_t3: "+id6_R_t3);
      var x = new Int16Array(data.x_sab); id7_R_t3 = x[0]; report.push("id7_R_t3: "+id7_R_t3);
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
outputs[0] = "id6_R_t3: 0;id7_R_t3: 0";
assert(-1 != outputs.indexOf(report));

// Expected Output (Compressed Data) //
//eNrt3UFPE0EUAOC7v6JHTUhKuywkGg8SQ7yoCR48EpN6aCLiAU6G/25LS1lhCpSdnd2ZfLdmujul3b6P
//J2+fbzy+uLr8c3U5Ho/ms8Oz07PL6u1o/918dnT7eDw+v5j9/LU44NPx6P3o7+v5bHr2/exysrc4o7p5
//9GZvtFg9WD6eLlfrm0er1dWey9XVjqvVyeKI8x/z38v1aWOP5nq1Zf2gsXtzvd6yfrjlddc/z/Xow5eP
//o89fS3xvN+t376i5+91qHVw9DO7Q3LcK7lsF962C+1bBfe8+68PgavPYOnhsff/Y1TU+PT65ucj/Xbnb
//T21x5v7y7G1PTh57cvrYk9X6yaPHXvMo/JrrH/xk/eUM7h8+e3Xmt+/LM69fjYW5MBfmkSL57snNhd/v
//PsgDryr0hb7Qj/QbfsfQ31zgScrQr4S+0Bf6u4d+21/sfQd+88uGAxzgYDCZwOYjSQpC80IIfaEv9JNn
//Av0EfjgTwAEOcJD0r/4Prdi8+WlKEGqhL/SFfuRKwE6ZQD+BH84EcIADHMTOBJ5RAOibgwoHOMBBLA7a
//FQWGmRsgAhGI6CtjePD3wr6ROAh+NXGAAxx0nTEMDoOn6wqIQAQisusxeFidbLD08g6De+vrPYW+0Bf6
//w+g7iBH4z+46wAEOcDDkXoS4HFQ4wAEOcu1P6C43QAQiEFFEz0JcJJ64RRkHOMDBcPsYUmQMiEAEIjLu
//bYiLRI0DHOAg136HFBkDIhCBiGx7ILqrSSACEYjIvi8idZ0CG9jARgG9Et3VLhCBCERk3z+Rup6BDWxg
//o9i5DY1/6UTrqaiEvtAX+sOe5bB74L+0pwIHOMDBwOc7tOGgwgEOcFDOzIdYuQEiEIGIQudAtEFitxum
//cYADHAx6NkT8jAERiEBEUfMi2iBR4wAHOChnhkT8jAERiEBEQXMlYtUkEIEIRBQ4a6LbOgU2sIGNIudP
//xKpdIAIRiChwJkW39QxsYAMbOfdUPHLXdZuOivCN1cJe2Av7/vspogb9U90UKEABCobaS9ERBRUKUICC
//jPooEuQEeMADHnLtoegIiPDt0ShAAQqG2T+RNFPAAx7wkFfvREdA1ChAAQoy6ptImingAQ94yKlnIkHt
//AQ94wEOO/RK91SOQgQxk5NkrkaBGgQc84CHHPone6hbIQAYyCp070bAo2tyJ9Z5CX+gL/aHOndg98F86
//dwIHOMDBwOdOtOGgwgEOcFDO3IlYuQEiEIGIQudOtEFit/9UHgc4wMGg507EzxgQgQhEFDV3og0SNQ5w
//gINy5k7EzxgQgQhEFDR3IlZNAhGIQESBcye6rVNgAxvYKHLuRKzaBSIQgYgC5050W8/ABjawUejciTYd
//FeEbq4W9sBf2g547Eb+bAgUoQEGGcyfid1KgAAUoyG7uRKouCjzgAQ8Zzp2I30GBAhSgILu5E6m6J/CA
//BzxkOHcifucEClCAguzmTqTqmsADHvCQ3dyJVB0TeMADHjKbO9FvtwQykIGM7OZOpOqUwAMe8JDZ3Il+
//uySeT8Y/LGEvWQ==
