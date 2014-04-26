%{
  var nodes = require('./nodes');
%}

/* lexical grammar */

%lex

%%

\s+                       /* skip whitespace */
'ft'                      return 'FEET';
"'"                       return 'FEET';
'in'                      return 'INCHES';
'"'                       return 'INCHES';
[A-Za-z_][A-Za-z0-9_]*    return 'IDENTIFIER';
\d[\d\.]*                 return 'NUMBER';
'('                       return '(';
')'                       return ')';
'*'                       return '*';
'/'                       return '/';
'+'                       return '+';
'-'                       return '-';
'>='                      return '>=';
'<='                      return '<=';
'!='                      return '!=';
'>'                       return '>';
'<'                       return '<';
'='                       return '=';
/*<<EOF>>                   return 'EOF';*/

/lex

/*%token IDENTIFIER NUMBER*/

/* operators */
%left '>' '>=' '<' '<='
%left '=' '!='
%left '*' '/'
%left '+' '-'

/*%start statement*/

%%

program:
  /* nothing */                { return new nodes.StatementNode(null) }
| expression                   { return new nodes.StatementNode($1); }
;

expression:
  IDENTIFIER                   { $$ = new nodes.GetDimensionNode($1); }
| NUMBER FEET                  { $$ = new nodes.FeetNode($1); }
| NUMBER INCHES                { $$ = new nodes.InchesNode($1); }
| NUMBER FEET NUMBER INCHES    { $$ = new nodes.FeetInchesNode($1, $3); }
/*| expression '*' expression    { $$ = new nodes.MultiplicationNode($1, $3); }*/
/*| expression '/' expression    { $$ = new nodes.DivisionNode($1, $3); }*/
| expression '+' expression    { $$ = new nodes.AdditionNode($1, $3); }
| expression '-' expression    { $$ = new nodes.SubtractionNode($1, $3); }
| expression '=' expression    { $$ = new nodes.EqualityNode($1, $3, false); }
| expression '!=' expression   { $$ = new nodes.EqualityNode($1, $3, true); }
| expression '>=' expression   { $$ = new nodes.LessThanNode($1, $3, true); }
| expression '<=' expression   { $$ = new nodes.GreaterThanNode($1, $3, true); }
| expression '>' expression    { $$ = new nodes.GreaterThanNode($1, $3, false); }
| expression '<' expression    { $$ = new nodes.LessThanNode($1, $3, false); }
| '(' expression ')'           { $$ = $2; }
;
