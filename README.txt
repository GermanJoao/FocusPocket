
FocusPocket Luxe (PWA) - Mobile-first premium edition
----------------------------------------------------
Arquivos:
- index.html
- style.css
- script.js
- manifest.json
- service-worker.js
- icons/icon-192.png
- icons/icon-512.png

Características:
- Tema dark padrão com opção light (toggle).
- Layout mobile-first com navegação inferior estilo iPhone app.
- FAB (botão flutuante) para adição rápida.
- Transações e tarefas salvos em LocalStorage (offline).
- Service worker pra cache básico.

Como testar localmente:
1) Descompacte a pasta e abra um terminal dentro dela.
2) Rode um servidor HTTP simples (recomendado): `python3 -m http.server 8000`
3) Abra http://localhost:8000 no navegador (Chrome recomendado).
4) Para testar PWA: abra devtools > Application > Manifest e depois 'Install' no navegador, ou no celular abra via servidor e escolha 'Adicionar à tela inicial'.

Exportar para Android (opcional):
- Use CapacitorJS para empacotar o conteúdo (já te passei o passo a passo antes).

Observações:
- Ícones gerados automaticamente; substitua se quiser um logo personalizado.
